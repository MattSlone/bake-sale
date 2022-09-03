'use strict'

/**
 * The strategy for checking out via Stripe is here:
 * https://stripe.com/docs/connect/charges-transfers
 */

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI(),
  { Op } = require("sequelize"),
  ProductController = require('./product'),
  Email = require('email-templates'),
  nodemailer = require('nodemailer'),
  env = require('../config/environment')
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
          const fulfillmentAddress = await this.getFulfillmentAddress(req.user)
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
            UserId: req.user.id,
            FulfillmentAddressId: fulfillmentAddress.id
          }, {
            include: [db.FulfillmentAddress]
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

  async getFulfillmentAddress(user) {
    const [fulfillmentAddress, created] = await db.FulfillmentAddress.findOrCreate({
      where: {
        street: user.street,
        street2: user.street2,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode
      }
    })
    return fulfillmentAddress
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

  async sendOrderCompleteEmails(order) {
    const user = await db.User.findByPk(order.UserId)
    const shopUser = await db.User.findByPk(order.Product.Shop.UserId)
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        secureConnection: false,
        requireTLS: true,
        tls: {
          ciphers: 'SSLv3'
        },
        debug: true,
        auth: {
          user: env.email,
          pass: env.emailPass
        }
      });
      const email = new Email({
        message: {
          from: env.email
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter
      });
      
      await email.send({
        template: 'orderComplete',
        message: {
          to: user.username
        },
        locals: {
          name: user.firstName,
          total: Number(order.total).toFixed(2),
          productName: order.Product.name,
          id: order.id,
          baseUrl: env.baseUrl,
          port: env.port
        }
      })

      await email.send({
        template: 'newShopOrder',
        message: {
          to: shopUser.username
        },
        locals: {
          name: shopUser.firstName,
          total: Number(order.total).toFixed(2),
          productName: order.Product.name,
          id: order.id,
          baseUrl: env.baseUrl,
          port: env.port
        }
      })
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
          transfer.payout*100, // Needs to be in cents
          transfer.Shop.stripeAccountId,
          data.charges.data[0].id
        )
        transfer.set({
          stripeTransferId: transferId
        });
        await transfer.save()

        const completedStatus = await db.OrderStatus.findOne({ where: { status: 'completed' } })
        const order = await db.Order.findOne({
          where: { TransferId: transfer.id },
          include: [
            {
              model: db.Product,
              include: [ db.Shop ]
            }
          ]
        })
        order.OrderStatusId = completedStatus.id
        const product = await db.Product.findByPk(order.ProductId)
        await (new ProductController).updateInventoryOnSuccessfulOrder(
          product.id,
          order.VarietyId,
          order.quantity
        )
        await order.save()
        await this.sendOrderCompleteEmails(order)
        await this.removeStaleOrders(order.UserId)
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
                      {
                        model: db.DeliverySchedule,
                        attributes: { exclude: ['id', 'ShopId', 'createdAt', 'updatedAt']}
                      },
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
                  'username'
                ]
              },
              db.FulfillmentAddress,
              ...(shop ? [
                {
                  model: db.Transfer,
                  attributes: ['payout', 'ourFee', 'stripeFee']
                }
              ] : [])
            ]
        })
        for (let i = 0; i < orders.length; i++) {
          if (['pickup', 'delivery'].includes(orders[i].fulfillment)) {
            const nextFulfillmentWindow = await this.getNextAvailableFulfillmentWindow(orders[i])
            orders[i].setDataValue('nextFulfillmentWindow', nextFulfillmentWindow)
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

  async getNextAvailableFulfillmentWindow(order) {
    try {
      const initialFulfillmentDay = Date.parse(order.createdAt)
        .clearTime()
        .addDays(order.processingTime)
      let window
      if (order.fulfillment === 'pickup') {
        order.Product.Shop.PickupSchedules.reverse()
        window = order.Product.Shop.PickupSchedules.find((day, index) => 
          index >= initialFulfillmentDay.getDay() && day.start !== day.end
          && new Date.getHours() < day.end.split(':')[0]
        )
        if (window === undefined) {
          window = order.Product.Shop.PickupSchedules.find((day, index) => 
            index > initialFulfillmentDay.getDay() && day.start !== day.end
          )
        }
        if (window === undefined) {
          window = order.Product.Shop.PickupSchedules.find(day => day.start !== day.end)
        }
        const pickupDate = new Date(initialFulfillmentDay).next()[window.day.toLowerCase()]().toString('dddd MMMM dS, yyyy')
        window = {
          ...window,
          date: pickupDate
        }
      } else if (order.fulfillment === 'delivery') {
        const deliveryDays = Object.keys(order.Product.Shop.DeliverySchedule.dataValues)
          .filter(day => order.Product.Shop.DeliverySchedule.dataValues[day] == true)
          .sort(
            (day1, day2) => new Date(initialFulfillmentDay).next()[day1.toLowerCase()]() -
              new Date(initialFulfillmentDay).next()[day2.toLowerCase()]()
          )
        const deliveryDate = new Date(initialFulfillmentDay).next()[deliveryDays[0].toLowerCase()]().toString('dddd MMMM dS, yyyy')
        window = {
          start: '00:00',
          end: '24:00',
          date: deliveryDate
        }
      }
      console.log(window)
      return window
    } catch (err) {
      console.log(err)
    }
  }

  static async validateCart(req, res, next) {
    try {
      if (
        !(req.user.firstName && req.user.lastName
          && req.user.street && req.user.city && req.user.state && req.user.zipcode
        )
      ) {
        req.flash('error', `You must complete your profile before checking out.`)
        res.redirect('/api/order/error')
        return
      }
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
