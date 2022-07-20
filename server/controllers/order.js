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

module.exports = class OrderController {
  async createPaymentIntent (req, res, next) {
    try {
      const shopAmounts = await this.mapCartToShopAmounts(req, req.body.items)
      const totalAmount = shopAmounts.map(shopAmount => shopAmount.amount)
        .reduce((prev, curr) => prev + curr)
      
      const paymentIntent = await StripeAPI.createPaymentIntent(totalAmount*100)

      for (const shop of shopAmounts) {
        const stripeFee = shop.amount*0.029 + 0.3
        const ourFee =shop.amount*0.05

        const transfer = await db.Transfer.create({
          amount: Number.parseFloat(shop.amount - stripeFee - ourFee).toFixed(2),
          stripeTransferId: 0,
          stripePaymentIntentId: paymentIntent.id,
          ShopId: shop.id
        })

        for (const item of shop.items) {
          // addon: {"addon name": true if added / false if not}
          const addonIds = Object.entries(item.addons).map(addon => addon[1] ? addon[0] : null)
            .filter(addon => addon !== null)
          const variation = await db.Variety.findOne({
            where: {
              ProductId: item.product.id,
              quantity: item.variation
            }
          })
          const pendingStatus = await db.OrderStatus.findOne({ where: { status: 'pending' } })
          console.log(item)
          const order = await db.Order.create({
            amount: await this.calculateProductPrice(req, item),
            quantity: item.quantity,
            processingTime: item.product.processingTime,
            TransferId: transfer.id,
            ProductId: item.product.id,
            VarietyId: variation.id,
            fulfillment: item.fulfillment,
            personalization: item.personalization,
            OrderStatusId: pendingStatus.id,
            UserId: req.user.id
          })
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

  async mapCartToShopAmounts(req, items) {
    try {
      const shops = items.map(item => item.product.ShopId)
        .filter((shop, index, shops) => shops.indexOf(shop) === index) // unique shops

      const shopItems = await Promise.all(shops.map(async id => {
        let itemsTest = await Promise.all(items.map(async item => {
          return {
            ...item,
            product: (await db.Product.findByPk(item.product.id))
          }
        }))
        return {
          id: id,
          items: itemsTest.filter(item => item.product.ShopId === id)
        }
      }))

      const shopAmounts = Promise.all(shopItems.map(async shop => {
        try {
          const shopInstance = await db.Shop.findByPk(shop.id, { attributes: ['stripeAccountId'], raw: true })
          const amounts = await Promise.all(shop.items.map(async item => {
            const productPrice = await this.calculateProductPrice(req, item)
            return productPrice * item.quantity
          }))
          const amount = amounts.reduce((prev, curr) => prev + curr)
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

  async calculateProductPrice(req, item) {
    try {
      console.log('clientSidePrice: ', item)
      let total = 0
      let selectedVariation = await db.Variety.findOne({
        where: {
          ProductId: item.product.id,
          quantity: item.variation
        }
      })
      if (item.product.custom) {
        const quote = await db.Quote.findOne({ where: { UserId: req.user.id, ProductId: item.product.id } })
        total = Number(quote.price)
      } else {
        total = Number(selectedVariation.price)
      }

      let addonsTotal = 0.0
      const addons = Object.entries(item.addons).map(addon => {
        return {
          id: addon[0],
          checked: addon[1]
        }
      })
      for (const addon of addons) {
        if(addon.checked) {
          let addonInstance = await db.Addon.findByPk(addon.id,
            { attributes: ['price', 'secondaryPrice', 'ProductId'] }
          )
          if (addonInstance.ProductId != item.product.id) {
            throw Error('ERROR: addon doesn\'t exist for this product. Handle accordingly')
          }
          addonsTotal += Number(addonInstance.price)
          addonsTotal += Number(addonInstance.secondaryPrice) * Number(item.variation-1)
        }
      }

      total += addonsTotal

      let fulfillmentPrice = 0.0
      if (item.fulfillment == 'delivery') {
        if (selectedVariation.deliveryFeeType == 'mile') {
          const shop = await db.Shop.findByPk(item.product.ShopId, {
            include: {
              model: db.PickupAddress,
              attributes: ['lat', 'lng']
            }
          })
          const distance = GMaps.haversine_distance(
            { lat: req.user.lat, lng: req.user.lng },
            { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
          )
          fulfillmentPrice = Number(selectedVariation.delivery) * (distance * 0.000621371)
        } else {
          fulfillmentPrice = Number(selectedVariation.delivery)
        }
      } else if(item.fulfillment == 'shipping') {
        fulfillmentPrice = Number(selectedVariation.shipping)
      }
      total += fulfillmentPrice
      console.log(total)
      console.log('serverSidePrice: ', Number(total).toFixed(2))
      return Number(total).toFixed(2)
    } catch (err) {
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
          transfer.amount*100, // Needs to be in cents
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
    const completedStatus = await db.OrderStatus.findOne({ where: { status: 'completed' } })
    const where = {
      OrderStatusId: completedStatus.id,
      ...(!shop && {UserId: req.user.id}),
      ...(req.query.orderId && {id: req.query.orderId })
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
                  }
                ],
                where: {
                  ...(shop && { ShopId: shop.id })
                }
              },
              db.Addon,
              ...(shop ? [
                {
                  model: db.User,
                  attributes: [
                    'firstName',
                    'lastName',
                    'street',
                    'city',
                    'state',
                    'zipcode']
                },
                {
                  model: db.Transfer,
                  attributes: ['amount']
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
        where: { OrderStatusId: pending.id, UserId: userId },
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
