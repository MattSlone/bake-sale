'use strict'

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI()

module.exports = class ShopController {
  async create (req, res, next) {
    try {
      const inactiveStatus = await db.ShopStatus.findOne({ where: { status: 'inactive' } })
      const shop = await db.Shop.create({
          name: req.body.name,
          state: req.body.state,
          allowPickups: req.body.allowPickups,
          UserId: req.user.id,
          PickupAddress: req.body.pickupAddress,
          PickupSchedules: req.body.pickupSchedule,
          ShopContact: req.body.contact,
          ShopStatusId: inactiveStatus.id
      }, {
        include: [
          db.PickupAddress,
          db.PickupSchedule,
          db.ShopContact
        ]
      });
      return shop
    }
    catch (err) {
      return next(err)
    }
  }

  async validateGetShop(req, res) {
    try {
      if (!(req.query.id || req.query.UserId)) {
        return false
      }
      const shop = await db.Shop.findOne({ where: { UserId: req.user.id } })
      if (req.query.forOrder) {
        const order = await db.Order.findOne({
          where: {
            UserId: req.user.id
          },
          include: [
            {
              model: db.Product,
              where: {
                ShopId: req.query.id ? req.query.id : shop.id
              }
            }
          ]
        })
        if (!order?.id) {
          return false
        }
      }
      return true
    } catch (err) {
      req.flash('error', 'Shop not found.')
    }
  }

  async read(req, res, next) {
    try {
      let shop = null
      const valid = await this.validateGetShop(req)
      if (!valid) {
        req.flash('error', 'Shop not found.')
        return
      }
      const include = [
        db.PickupSchedule,
        ...[(req.query.UserId || req.query.forOrder)
          && db.PickupAddress],
        ...[(req.query.UserId || req.query.forOrder) 
          && db.ShopContact]
      ]
      const where = {
        ...(req.query.UserId && { UserId: req.user.id }),
        ...(req.query.id && { id: req.query.id })
      }
      const attributes = [
        ...[req.query.forOrder && 'name']
      ]
      shop = await db.Shop.findOne({
        ...(!(attributes[0] == undefined) && { attributes: attributes }),
        include: include,
        where: where
      });
      console.log(shop)
      return shop
    }
    catch (err) {
      req.flash('error', "Shop not found.")
    }
  }

  async update (req, res, next) {
    try {
      let shop = await db.Shop.update(req.body,
        {
          where: {id: req.body.id},
        }
      );

      shop = await db.Shop.findByPk(req.body.id, 
        {
            include: [db.PickupAddress, db.PickupSchedule, db.ShopContact]
        }
      );
      console.log(req.body.pickupAddress)
      let pickupAddresses = await this.upsertAssociation(shop, db.PickupAddress, [req.body.pickupAddress])
      await shop.setPickupAddress(pickupAddresses.map(address => address.id))
      await db.PickupAddress.destroy({
          where: { ShopId: null }
      })

      let pickupSchedules = await this.upsertAssociation(shop, db.PickupSchedule, req.body.pickupSchedule)
      await shop.setPickupSchedules(pickupSchedules.map(schedule => schedule.id))
      await db.PickupSchedule.destroy({
          where: { ShopId: null }
      })

      let shopContacts = await this.upsertAssociation(shop, db.ShopContact, [req.body.contact])
      await shop.setShopContact(shopContacts.map(contact => contact.id))
      await db.ShopContact.destroy({
          where: { ShopId: null }
      })

      shop = await db.Shop.findByPk(req.body.id, 
        {
            include: [db.PickupAddress, db.PickupSchedule, db.ShopContact]
        }
      );
      
      return shop
    }
    catch (err) {
      return next(err)
    }
  }

  async upsertAssociation(shop, model, data, hasMany = false) {
    let associatedInstance = await Promise.all(data.map(async values => {
        const [instance, created] = await model.upsert(hasMany ? {...values} : {
            ...values,
            ShopId: shop.id
        }, {
            include: hasMany ? [db.Shop] : []
        });

        return instance
    }))

    return associatedInstance
  }

  async createStripeAccount(req, res, next) {
    try {
      const shop = await db.Shop.findOne({ where: { UserId: req.user.id } })
      if (shop) {
        let accountId = shop.stripeAccountId
        if (!accountId) {
          const account = await StripeAPI.createAccount()
          accountId = account.id
          shop.stripeAccountId = accountId
          await shop.save()
        }
        const accountLink = await StripeAPI.createAccountLink(accountId, req.body.edit)
        return accountLink.url
      }
      req.flash('error', 'A shop is not associated with this user account.')
      res.redirect('/api/shop/stripe/create')
      return
    }
    catch (err) {
      req.flash('error', 'An error occured while reaching Stripe.')
      res.redirect('/api/shop/stripe/create')
      return
    }
  }

  async checkDetailsSubmitted(req, res, next) {
    try {
      const detailsSubmitted = await StripeAPI.checkDetailsSubmitted(req.user.id)
      console.log("DETAILS SUBMITTED: ", detailsSubmitted)
      return detailsSubmitted
    }
    catch (err) {
      console.log(err)
      req.flash('error')
    }
  }

  /* async list (req, res, next) {
    try {
      console.log(req.user)
      let tickets
      if (req.user.tenant) {
        tickets = await Ticket.find({ tenant: req.user.tenant }).populate('tenant unit').exec()
      }
      else {
        tickets = await Ticket.find({}).populate('tenant unit assigned').exec()
      }
      return tickets
    }
    catch (err) {
      return next(err)
    }
  } */
}
