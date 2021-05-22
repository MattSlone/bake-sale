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
          address: req.body.area.address,
          radius: req.body.area.radius,
          lat: req.body.area.lat,
          lng: req.body.area.lng,
          UserId: req.body.userId,
          Products: [
            {
              name: req.body.product.name,
              category: req.body.product.category,
              description: req.body.product.description,
              automaticRenewal: req.body.product.automaticRenewal,
              inventory: req.body.product.inventory,
              Varieties: req.body.product.varieties,
              Ingredients: ingredients
            }
          ]
      }, {
        include: [{
          association: db.Shop.Product,
          include: [ 
            db.Product.Ingredient,
            db.Product.Variety
          ]
        }]
      });

      return shop
    }
    catch (err) {
      return next(err)
    }
  }

  async read(req, res, next) {
    try {
      const shop = await db.Shop.findByPk(req.query.id);

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
      shop.address = req.body.area.address
      shop.radius = req.body.area.radius
      shop.lat = req.body.area.lat
      shop.lng = req.body.area.lng

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
