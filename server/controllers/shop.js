'use strict'

const db = require('../models/index')

module.exports = class ShopController {
  async create (req, res, next) {
    try {

      const shop = await db.Shop.create({
          name: req.body.name,
          state: req.body.state,
          location: req.body.area.location,
          allowPickups: req.body.allowPickups,
          radius: req.body.area.radius,
          lat: req.body.area.lat,
          lng: req.body.area.lng,
          UserId: req.body.user,
          PickupAddress: req.body.pickupAddress,
          PickupSchedules: req.body.pickupSchedule,
          ShopContact: req.body.contact,
          Products: [
            {
              name: req.body.product.name,
              category: req.body.product.category,
              processingTime: req.body.product.processingTime,
              description: req.body.product.description,
              automaticRenewal: req.body.product.automaticRenewal,
              inventory: req.body.product.inventory,
              fields: req.body.product.fields,
              personalizationPrompt: req.body.product.personalizationPrompt,
              Varieties: req.body.product.varieties,
              Addons: req.body.product.addons,
              Ingredients: req.body.product.ingredients
            }
          ]
      }, {
        include: [
          db.PickupAddress,
          db.PickupSchedule,
          db.ShopContact,
          {
            association: db.Shop.Product,
            include: [ 
              db.Product.Ingredient,
              db.Product.Variety,
              db.Product.Addon,
            ]
          }
        ]
      });

      return shop
    }
    catch (err) {
      return next(err)
    }
  }

  async read(req, res, next) {
    try {
      if(req.query.UserId) {
        const shop = await db.Shop.findOne({ 
          where: { UserId:  req.query.UserId},
          include: [db.PickupAddress, db.PickupSchedule, db.ShopContact]
        });
        return shop
      }
      const shop = await db.Shop.findByPk(req.query.id, {
        include: [db.PickupAddress, db.PickupSchedule, db.ShopContact]
      });
      return shop
    }
    catch (err) {
      return next(err)
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
