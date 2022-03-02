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
        const stripeFee = 0.032
        const ourFee = 0.05

        const transfer = await db.Transfer.create({
          amount: Number.parseFloat(shop.amount * (1 - stripeFee - ourFee)).toFixed(2),
          stripeTransferId: 0,
          stripePaymentIntentId: paymentIntent.id,
          ShopId: shop.id
        })

        for (const item of shop.items) {
          const addonIds = Object.entries(item.addons).map(addon => addon[1] ? addon[0] : null)
            .filter(addon => addon !== null)
          const order = await db.Order.create({
            amount: await this.calculateProductPrice(item),
            TransferId: transfer.id,
            ProductId: item.product.id,
            VarietyId: item.variation,
            fulfillment: item.fulfillment
          })
          await order.setAddons(addonIds)
        }
      }
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
          console.log('hereeee')
          const transfers = await db.Transfer.findAll({
            include: {
              model: db.Shop,
              attributes: ['stripeAccountId'],
              required: true
            },
            where: { stripePaymentIntentId: data.id }
          })
          transfers.forEach(async transfer => {
            console.log('creating transfer...')
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
