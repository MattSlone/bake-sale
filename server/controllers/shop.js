'use strict'

const db = require('../models/index'),
  MakeStripeAPI = require('../lib/stripe'),
  StripeAPI = new MakeStripeAPI(),
  GMaps = require('../lib/gmaps'),
  validator = require('validator'),
  { Op } = require('sequelize')

module.exports = class ShopController {
  async create (req, res, next) {
    try {
      const inactiveStatus = await db.ShopStatus.findOne({ where: { status: 'inactive' } })
      const shop = await db.Shop.create({
          name: req.body.name,
          description: req.body.description,
          uri: await this.makeURISafeName(req.body.name),
          state: req.body.state,
          allowPickups: req.body.allowPickups,
          UserId: req.user.id,
          PickupAddress: req.body.pickupAddress,
          PickupSchedules: req.body.pickupSchedule,
          DeliverySchedule: req.body.deliverySchedule,
          ShopContact: {
            ...req.body.contact,
            email: req.body.contact.email.replace(/\s/g, "")
          },
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

  async makeURISafeName(name) {
    return name.replace(/[^a-zA-Z0-9-_]/g, '');
  }

  async validateGetShop(req, res) {
    try {
      if (!(req.query.id || req.query.uri || req.query.name || req.query.UserId)) {
        return false
      }
      const ownShop = await db.Shop.findOne({ where: { UserId: req.user.id } })
      if (req.query.forOrder) {
        const order = await db.Order.findOne({
          where: {
            UserId: req.user.id
          },
          include: [
            {
              model: db.Product,
              where: {
                ShopId: req.query.id ? req.query.id : ownShop.id
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
      console.log(err)
      return false
    }
  }

  static async validateCreateOrEditShop(req, res, next) {
    try {
      for (const field of [
        { name: 'Shop Name', value: req.body.name },
        { name: 'Shop Description', value: req.body.description },
        { name: 'Street', value: req.body.pickupAddress.street },
        { name: 'City', value: req.body.pickupAddress.city },
        { name: 'State', value: req.body.pickupAddress.state },
        { name: 'Zipcode', value: req.body.pickupAddress.zipcode },
        { name: 'Pickup Schedule', value: req.body.pickupSchedule }
        
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/shop/create')
          return
        }
      }
      if (!validator.isByteLength(req.body.name, { max: 30 })) {
        req.flash('error', 'Shop names may have a max of 30 characters.')
        res.redirect('/api/shop/create')
        return
      }
      if (!validator.isByteLength(req.body.description, { max: 2000 })) {
        req.flash('error', 'Shop descriptions may have a max of 2000 characters.')
        res.redirect('/api/shop/create')
        return
      }
      const nameAlreadyExists = await db.Shop.findOne({ where: {
        [Op.or]: {
          name: req.body.name,
          uri: await (new ShopController).makeURISafeName(req.body.name)
        },
        [Op.not]: {
          UserId: req.user.id
        }
      }})
      if (nameAlreadyExists) {
        req.flash('error', 'Shop name is taken.')
        res.redirect('/api/shop/create')
        return
      }
      if (req.body.allowPickups) {
        if (req.body.contact.type == 'none') {
          req.flash('error', 'A contact method must be provided if you allow pickups.')
          res.redirect('/api/shop/create')
          return
        }
        if(
          !req.body.pickupSchedule.map(day => day.start !== day.end)
            .some(window => window == true)
        ) {
          req.flash('error', 'You must provide at least one window of time in a week if you allow pickups.')
          res.redirect('/api/shop/create')
          return
        }
      }
      if ((req.body.contact.type == 'both' || req.body.contact.type == 'phone')
        && !validator.isMobilePhone(req.body.contact.phone, "en-US")
      ) {
        req.flash('error', 'Invalid phone number')
        res.redirect('/api/shop/create')
        return
      }
      
      if ((req.body.contact.type == 'both' || req.body.contact.type == 'email')
        && !validator.isEmail(req.body.contact.email.replace(/\s/g, ""))
      ) {
        req.flash('error', 'Invalid Email.')
        res.redirect('/api/shop/create')
        return
      }
      if (!(req.body.pickupAddress.radius >= 0)) {
        req.flash('error', 'Radius must be at least 0.')
        res.redirect('/api/shop/create')
        return
      }
      const addressComponents = await GMaps.getFormattedAddress(req.body.pickupAddress)
      if (typeof addressComponents == 'string') {
        req.flash('error', 'There was an issue validating your address.')
        res.redirect('/api/shop/create')
        return
      }
      next()
    } catch (err) {
      req.flash('error', err.message)
      res.redirect('/api/shop/create')
      return
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
        {
          model: db.DeliverySchedule,
          attributes: { exclude: ['id', 'ShopId', 'createdAt', 'updatedAt'] }
        },
        ...(req.query.UserId || req.query.forOrder)
          ? [db.PickupAddress, db.ShopContact] : []
      ]
      const where = {
        ...(req.query.UserId && { UserId: req.user.id }),
        ...(req.query.uri && { uri: req.query.uri }),
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
      return shop
    }
    catch (err) {
      console.log(err)
      req.flash('error', "Shop not found.")
    }
  }

  async update (req, res, next) {
    try {
      let shop = await db.Shop.update({
          ...req.body,
          uri: await this.makeURISafeName(req.body.name)
        },
        {
          where: {id: req.body.id},
        }
      );
      shop = await db.Shop.findByPk(req.body.id, 
        {
            include: [db.PickupAddress, db.PickupSchedule, db.ShopContact]
        }
      );
      let pickupAddresses = await this.upsertAssociation(shop, db.PickupAddress, [req.body.pickupAddress])
      await shop.setPickupAddress(pickupAddresses.map(address => address.id))
      await db.PickupAddress.destroy({
          where: { ShopId: null }
      })

      let deliverySchedule = await this.upsertAssociation(shop, db.DeliverySchedule, [req.body.deliverySchedule])
      await shop.setDeliverySchedule(deliverySchedule.map(day => day.id))
      await db.DeliverySchedule.destroy({
          where: { ShopId: null }
      })

      let pickupSchedules = await this.upsertAssociation(shop, db.PickupSchedule, req.body.pickupSchedule)
      await shop.setPickupSchedules(pickupSchedules.map(schedule => schedule.id))
      await db.PickupSchedule.destroy({
          where: { ShopId: null }
      })

      let shopContacts = await this.upsertAssociation(shop, db.ShopContact, [{
        ...req.body.contact,
        email: req.body.contact.email.replace(/\s/g, "")
      }])
      await shop.setShopContact(shopContacts.map(contact => contact.id))
      await db.ShopContact.destroy({
          where: { ShopId: null }
      })

      shop = await db.Shop.findByPk(req.body.id, 
        {
          include: [
            db.PickupAddress,
            {
              model: db.DeliverySchedule,
              attributes: { exclude: ['id', 'ShopId', 'createdAt', 'updatedAt'] }
            },
            db.PickupSchedule,
            db.ShopContact
          ]
        }
      );
      
      return shop
    }
    catch (err) {
      console.log('here', err)
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
