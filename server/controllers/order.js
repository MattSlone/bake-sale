'use strict'

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI()

module.exports = class OrderController {
  async createPaymentIntent (req, res, next) {
    try {
      console.log(req.body)
      const shopAmounts = await this.mapCartToShopAmounts(req.body.items)
      const totalAmount = shopAmounts.map(shopAmount => shopAmount.amount)
        .reduce((prev, curr) => prev + curr)
      console.log('total: ', totalAmount)
      const order = await db.Order.create({ amount: totalAmount }) 
      const paymentIntent = await StripeAPI.createPaymentIntent(order.id, totalAmount)
      shopAmounts.forEach(async shop => {
        //const id = StripeAPI.createTransfer(shop.amount, shop.stripeAccountId, order.id)
        await db.Transfer.create({ 
          amount: shop.amount,
          stripeTransfer: 0,
          OrderId: order.id
        })
      });
      return paymentIntent.client_secret
    }
    catch (err) {
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
          const amount = shop.items.map(item => Number.parseFloat(item.clientSidePrice) * Number.parseInt(item.quantity))
            .reduce((prev, curr) => prev + curr)
          return {
            id: shop.id,
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
}
