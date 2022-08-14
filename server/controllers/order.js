'use strict'

/**
 * The strategy for checking out via Stripe is here:
 * https://stripe.com/docs/connect/charges-transfers
 */

const GMaps = require('../lib/gmaps')
const order = require('../models/order')
const product = require('../routes/product')

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI(),
  { Op } = require("sequelize"),
  ProductController = require('./product')
require('datejs')

const STRIPE_FEE_MULTIPLE = 0.029
const STRIPED_FIXED_FEE = 0.3
const OUR_FEE_MULTIPLE = 0.05

module.exports = class OrderController {
  async createPaymentIntent (req, res, next) {
    try {
      const shopAmounts = await this.mapCartToShopAmounts(req, req.body.items)
      const totalAmount = shopAmounts.map(shopAmount => shopAmount.amount)
        .reduce((prev, curr) => prev + curr)
      
      const paymentIntent = await StripeAPI.createPaymentIntent(totalAmount*100)

      for (const shop of shopAmounts) {
        const stripeFee = this.calculateStripeFee(shop.amount)
        const ourFee = this.calculateOurFee(shop.amount)
        const payout = Number.parseFloat(shop.amount - stripeFee - ourFee).toFixed(2)
        const transfer = await db.Transfer.create({
          orderTotal: shop.amount,
          ourFee: ourFee,
          stripeFee: stripeFee,
          payout: payout,
          stripeTransferId: 0,
          stripePaymentIntentId: paymentIntent.id,
          ShopId: shop.id
        })

        for (const item of shop.items) {
          const variation = await db.Variety.findOne({
            where: {
              ProductId: item.product.id,
              quantity: item.variation
            }
          })
          const pendingStatus = await db.OrderStatus.findOne({ where: { status: 'pending' } })
          const productPrice = await (new ProductController).calculateProductPrice(req, item, variation)
          const fulfillmentPrice = await (new ProductController).calculateFulfillmentPrice(req, item, variation)
          const secondaryFulfillmentPrice = await (new ProductController).calculateSecondaryFulfillmentPrice(req, item, variation)
          const orderTotal = (
            (productPrice * item.quantity)
            + fulfillmentPrice
            + secondaryFulfillmentPrice*(item.quantity-1)
          )
          const order = await db.Order.create({
            productPrice: productPrice,
            fulfillmentPrice: fulfillmentPrice,
            secondaryFulfillmentPrice: secondaryFulfillmentPrice,
            quantity: item.quantity,
            total: orderTotal,
            processingTime: item.product.processingTime,
            fulfillment: item.fulfillment,
            personalization: item.personalization,
            TransferId: transfer.id,
            ProductId: item.product.id,
            VarietyId: variation.id,
            OrderStatusId: pendingStatus.id,
            UserId: req.user.id
          })
          // addon: {"addon name": true if added / false if not}
          const addonIds = Object.entries(item.addons)
            .map(addon => addon[1] ? addon[0] : null)
            .filter(addon => addon !== null)
          await order.setAddons(addonIds)
        }
      }
      return paymentIntent.client_secret
    }
    catch (err) {
      console.log(err)
      return next(err)
    }
  }

  calculateOurFee(amount) {
    return amount * OUR_FEE_MULTIPLE
  }

  calculateStripeFee(amount) {
    return amount * STRIPE_FEE_MULTIPLE + STRIPED_FIXED_FEE
  }

  async calculateOrderTotal(req, item, variation) {
    const productPrice = await (new ProductController).calculateProductPrice(req, item, variation)
    const fulfillmentPrice = await (new ProductController).calculateFulfillmentPrice(req, item, variation)
    const secondaryFulfillmentPrice = await (new ProductController).calculateSecondaryFulfillmentPrice(req, item, variation)
    const orderTotal = (
      (productPrice * item.quantity)
      + fulfillmentPrice
      + secondaryFulfillmentPrice*(item.quantity-1)
    )
    return orderTotal
  }

  async mapCartToShopAmounts(req, items) {
    try {
      const shops = items.map(item => item.product.ShopId)
        .filter((shop, index, shops) => shops.indexOf(shop) === index) // unique shops

      const shopsItems = await Promise.all(shops.map(async id => {
        let shopItems = await Promise.all(items.map(async item => {
          return {
            ...item,
            product: (await db.Product.findByPk(item.product.id))
          }
        }))
        return {
          id: id,
          items: shopItems.filter(item => item.product.ShopId === id)
        }
      }))

      const shopAmounts = Promise.all(shopsItems.map(async shop => {
        try {
          const shopInstance = await db.Shop.findByPk(shop.id, { attributes: ['stripeAccountId'], raw: true })
          const amounts = await Promise.all(shop.items.map(async item => {
            let selectedVariation = await db.Variety.findOne({
              where: {
                ProductId: item.product.id,
                quantity: item.variation
              }
            })
            const shopItemOrderTotal = await this.calculateOrderTotal(req, item, selectedVariation)
            console.log('shopItemOrderTotal: ', shopItemOrderTotal)
            return shopItemOrderTotal
          }))
          const amount = amounts.reduce((prev, curr) => prev + curr, 0)
          return {
            id: shop.id,
            items: shop.items,
            amount: amount,
            stripeAccountId: shopInstance.stripeAccountId
          }
        } catch (err) {
            console.log(err)
        }
      }))
      return shopAmounts
    } catch(err) {
      console.log(err)
    }
  }

  

  async handleStripePaymentIntentSucceeded(data) {
    const transfers = await db.Transfer.findAll({
      include: {
        model: db.Shop,
        attributes: ['stripeAccountId'],
        required: true
      },
      where: { stripePaymentIntentId: data.id }
    })
    transfers.forEach(async transfer => {
      try {
        const transferId = await StripeAPI.createTransfer(
          transfer.payout*100, // Needs to be in cents
          transfer.Shop.stripeAccountId,
          data.charges.data[0].id
        )
        transfer.set({
          stripeTransferId: transferId
        });
        await transfer.save()

        const completedStatus = await db.OrderStatus.findOne({ where: { status: 'completed' } })
        const order = await db.Order.findOne({ where: { TransferId: transfer.id } })
        order.OrderStatusId = completedStatus.id
        const product = await db.Product.findByPk(order.ProductId)
        await (new ProductController).updateInventoryOnSuccessfulOrder(
          product.id,
          order.VarietyId,
          order.quantity
        )
        await order.save()
        this.removeStaleOrders(order.UserId)
      } catch (err) {
        console.log(err)
      }
    })
  }

  async handleStripeWebhooks(req, res, next) {
    try {
      const [event, data] = StripeAPI.handleWebhooks(req, res, next)
      switch (event) {
        case 'payment_intent.succeeded':
          this.handleStripePaymentIntentSucceeded(data)
          return 200
        default:
          return 200
      }
    } catch (err) {
      console.log(err)
    }
  }

  async list(req, res, next) {
    const shop = req.query.forShop ? await db.Shop.findOne({ where: { UserId: req.user.id } }) : null
    if (req.query.forShop && !shop) {
      return []
    }
    const completedStatus = await db.OrderStatus.findOne({ where: { status: 'completed' } })
    const where = {
      OrderStatusId: completedStatus.id,
      ...(!shop && {UserId: req.user.id}),
      ...(req.query.id && {id: [req.query.id] })
    }

    try {
        const orders = await db.Order.findAll({
            where: where,
            include: [
              db.Variety,
              {
                model: db.Product,
                required: true,
                include: [
                  {
                    model: db.Shop,
                    attributes: ['name'],
                    include: [
                      db.PickupAddress,
                      db.PickupSchedule,
                      db.ShopContact
                    ]
                  },
                  {
                    model: db.ProductImage,
                    attributes: ['path'],
                    limit: 1
                  }
                ],
                where: {
                  ...(shop && { ShopId: shop.id })
                }
              },
              db.Addon,
              {
                model: db.User,
                attributes: [
                  'firstName',
                  'lastName',
                  'street',
                  'street2',
                  'city',
                  'state',
                  'zipcode',
                  'username'
                ]
              },
              ...(shop ? [
                {
                  model: db.Transfer,
                  attributes: ['payout', 'ourFee', 'stripeFee']
                }
              ] : [])
            ]
        })
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].fulfillment == 'pickup') {
            const nextPickupWindow = await this.getNextAvailablePickupWindow(orders[i])
            orders[i].setDataValue('nextPickupWindow', nextPickupWindow)
          }
        }
        return orders
    }
    catch(err) {
        return err
    }
}

  async upsertAssociation(order, model, data, hasMany = false) {
    let associatedInstances = await Promise.all(data.map(async values => {
      const [instance, created] = await model.upsert(hasMany ? {...values} : {
          ...values,
          OrderId: order.id
      }, {
          include: hasMany ? [db.Order] : []
      });
      return instance
    }))

    return associatedInstances
  }

  async removeStaleOrders(userId) {
    try {
      const pending = await db.OrderStatus.findOne({ where: { status: 'pending' } })
      const staleOrders = await db.Order.findAll({
        where: {
          OrderStatusId: pending.id,
          UserId: userId
        },
        include: db.Transfer
      })
      for (let order of staleOrders) {
        if (order.Transfer) {
          await order.Transfer.destroy()
        }
        await order.destroy()
      }
    } catch (err) {
      console.log(err)
    }
  }

  async getNextAvailablePickupWindow(order) {
    const fulfillmentDay = Date.today()
      .set({ day: new Date(order.createdAt).getDate() })
      .clearTime()
      .add(order.processingTime + 1).day()
      .getDay()
    console.log('fulfillMentDate and Day: ', fulfillmentDay)
    order.Product.Shop.PickupSchedules.reverse()
    let window = order.Product.Shop.PickupSchedules.find((day, index) => 
      index >= fulfillmentDay && day.start !== day.end
      && (new Date).getHours() < day.end.split(':')[0]
    )
    if (window === undefined) {
      window = order.Product.Shop.PickupSchedules.find((day, index) => 
        index > fulfillmentDay && day.start !== day.end
      )
    }
    if (window === undefined) {
      window = order.Product.Shop.PickupSchedules.find(day => day.start !== day.end)
    }
    const pickupDate = Date.today().add(order.processingTime).day()
      .next()[window.day.toLowerCase()]()
      .toString('dddd MMMM dS, yyyy')
    window = {
      ...window,
      date: pickupDate
    }
    return window
  }

  static async validateCart(req, res, next) {
    try {
      const products = await Promise.all(req.body.items.map(async item => {
        return await db.Product.findOne({
          attributes: ['id', 'inventory', 'name'],
          where: { id: item.product.id },
          include: [db.Variety, db.Addon, db.Shop]
        })
      }))
      const productsUnique = products.filter((product, index) => products.indexOf(product) === index)
      for (let product of productsUnique) {
        const orderItems = req.body.items.filter(item => item.product.id == product.id)
        const orderQuantity = orderItems.map(item => Number(item.variation) * Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0)
        if (orderQuantity > product.inventory) {
          req.flash('error', `Order quantity ${orderQuantity} exceeds product inventory \
            ${product.inventory} for ${product.name}.`
          )
          res.redirect('/api/order/error')
          return
        }
        const orderVariations = orderItems.map(item => item.variation)
        for (let variation of orderVariations) {
          const isValidVariation = product.Varieties.map(variety => variety.quantity).includes(variation)
          if(!isValidVariation) {
            req.flash('error', `Package quantity ${variation} is not available for ${product.name}.`)
            res.redirect('/api/order/error')
            return
          }
        }
        const orderFulfillments = orderItems.map(item => {
          return {
            fulfillment: item.fulfillment,
            variation: item.variation
          }
        })
        const orderVariationInstances = await db.Variety.findAll({
          where: {
            quantity: { [Op.In]: orderVariations },
            ProductId: product.id
          }
        })
        for (let fulfillment of orderFulfillments) {
          console.log('FULFILLMENT: ', fulfillment.fulfillment)
          if (fulfillment.fulfillment == 'pickup' && !product.Shop.allowPickups) {
            req.flash('error', `${product.Shop.name} does not allow pickups. \
              Please change your choice of fulfillment for ${product.name}`
            )
            res.redirect('/api/order/error')
            return
          } else if (fulfillment.fulfillment == 'shipping') {
            for (let orderVariationInstance of orderVariationInstances) {
              if (orderVariationInstance.shipping == null 
                && orderVariationInstance.quantity == fulfillment.variation
              ) {
                req.flash('error', `Shipping is not offered for package quantity \
                  ${fulfillment.variation} of ${product.name}. Please change your \
                  choice of fulfillment for ${product.name}`
                )
                res.redirect('/api/order/error')
                return
              }
            }
          } else if (fulfillment.fulfillment == 'delivery') {
            const localShopIds = await (new ProductController).getLocalShopIds(req.user)
            console.log(localShopIds)
            if (!localShopIds.includes(product.Shop.id)) {
              req.flash('error', `Your address is not within ${product.Shop.name}'s delivery area.`)
              res.redirect('/api/order/error')
              return
            }
            for (let orderVariationInstance of orderVariationInstances) {
              if (orderVariationInstance.delivery == null 
                && orderVariationInstance.quantity == fulfillment.variation
              ) {
                req.flash('error', `Delivery is not offered for package quantity \
                  ${fulfillment.variation} of ${product.name}. Please change your \
                  choice of fulfillment.`
                )
                res.redirect('/api/order/error')
                return
              }
            }
          }
        }
      }
      next()
    } catch (err) {
      console.log(err)
      req.flash('error', err)
      res.redirect('/api/order/error')
      return
    }
  }
}
