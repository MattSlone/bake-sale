'use strict'

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI()

module.exports = class OrderController {
  async createPaymentIntent (req, res, next) {
    try {
      const shopAmounts = await this.mapCartToShopAmounts(req.body.items)
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
          console.log('VARIATION: ', item.variation)
          const pendingStatus = await db.OrderStatus.findOne({ where: { status: 'pending' } })
          const order = await db.Order.create({
            amount: await this.calculateProductPrice(item),
            quantity: item.quantity,
            TransferId: transfer.id,
            ProductId: item.product.id,
            VarietyId: item.variation,
            fulfillment: item.fulfillment,
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

  async mapCartToShopAmounts(items) {
    try {
      const shops = items.map(item => item.product.ShopId)
        .filter((shop, index, shops) => shops.indexOf(shop) === index)

      const shopItems = shops.map(id => {
        const itemsTest = items.filter(item => item.product.ShopId === id)
        return {
          id: id,
          items: itemsTest
        }
      })

      const shopAmounts = Promise.all(shopItems.map(async shop => {
        try {
          const shopInstance = await db.Shop.findByPk(shop.id, { attributes: ['stripeAccountId'], raw: true })
          const amounts = await Promise.all(shop.items.map(async item => {
            const productPrice = await this.calculateProductPrice(item)
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

  async calculateProductPrice(item) {
    try {
      console.log('clientSidePrice: ', item.clientSidePrice)
      let selectedVariation = await db.Variety.findOne({ where: { ProductId: item.product.id, quantity: item.variation } })
      let total = selectedVariation.price

      let addonsTotal = 0.0
      const addons = Object.entries(item.addons).map(addon => {
        return {
          id: addon[0],
          checked: addon[1]
        }
      })
      for (const addon of addons) {
        if(addon.checked) {
          let addonInstance = await db.Addon.findByPk(addon.id, { attributes: ['price', 'secondaryPrice', 'ProductId'] })
          if (addonInstance.ProductId != item.product.id) {
            throw Error('ERROR: addon doesn\'t exist for this product. Handle accordingly')
          }
          addonsTotal += addonInstance.price
          addonsTotal += addonInstance.secondaryPrice * (item.variation-1)
        }
      }

      total += addonsTotal

      let fulfillmentPrice = 0.0
      if (item.fulfillment == 'delivery') {
        fulfillmentPrice = selectedVariation.delivery
      } else if(item.fulfillment == 'shipping') {
        fulfillmentPrice = selectedVariation.shipping
      }

      total += fulfillmentPrice

      console.log('serverSidePrice: ', Number.parseFloat(total).toFixed(2))
      return Number.parseFloat(total).toFixed(2)
    } catch (err) {
      console.log(err)
    }
  }

  async handleStripeWebhooks(req, res, next) {
    try {
      const [event, data] = StripeAPI.handleWebhooks(req, res, next)
      switch (event) {
        case 'payment_intent.succeeded':
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
                transfer.amount*100,
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
              await order.save()
              this.removeStaleOrders(order.UserId)
            } catch (err) {
              console.log(err)
            }
          })
          return 200
        default:
          return 200
      }
    } catch (err) {
      console.log(err)
    }
  }

  async list(req, res, next) {
    let where = {}
    if (req.query.shop) {
        where.ShopId = req.query.shop
    } else {
      where.UserId = req.user.id
    }
    if(req.query.orderID) {
        where.id = req.query.orderID
    }

    try {
        const orders = db.Order.findAll({
            where: where,
            include: [
              db.Variety,
              {
                model: db.Product,
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
                ]
              },
              db.Addon
            ]
        });
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
      const staleOrders = await db.Order.findAll({ where: { OrderStatusId: pending.id, UserId: userId } })
      for (let order of staleOrders) {
        await order.destroy()
      }
    } catch (err) {
      console.log(err)
    }
  }
}
