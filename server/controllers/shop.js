'use strict'

const db = require('../models/index')

module.exports = class ShopController {
  async create (req, res, next) {
    try {

      /* setup ingredients objects */
      let ingredients = []
      req.body.product.ingredients.forEach((name) => {
          ingredients.push({
              name: name,
              allergen: false
          })
      })

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
          PickupSchedule: req.body.pickupSchedule,
          ShopContact: req.body.contact,
          Products: [
            {
              name: req.body.product.name,
              category: req.body.product.category,
              processingTime: req.body.product.processingTime,
              description: req.body.product.description,
              automaticRenewal: req.body.product.automaticRenewal,
              inventory: req.body.product.inventory,
              personalizationPrompt: req.body.product.personalizationPrompt,
              Varieties: req.body.product.varieties,
              Addons: req.body.product.addons,
              Ingredients: ingredients
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
      const shop = await db.Shop.findByPk(req.body.id);

      if (shop === null) {
        throw "Shop not found!"
      }

      shop.name = req.body.name
      shop.state = req.body.state
      shop.allowPickups = req.body.allowPickups
      shop.location = req.body.area.location
      shop.radius = req.body.area.radius
      shop.lat = req.body.area.lat
      shop.lng = req.body.area.lng

      shop.setPickupAddress(req.body.pickupAddress)
      shop.setPickupSchedule(req.body.pickupSchedule)
      shop.setShopContact(req.body.contact)

      await shop.save();
      
      return shop
    }
    catch (err) {
      return next(err)
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
