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
              price: req.body.product.price,
              Ingredients: ingredients
            }
          ]
      }, {
        include: [{
          association: db.Shop.Product,
          include: [ db.Product.Ingredient ]
        }]
      });

      return shop
    }
    catch (err) {
      return next(err)
    }
  }

  async update (req, res, next) {
    try {
      const shop = await db.Shop.upsert({
          name: req.body.name,
          state: req.body.state,
          address: req.body.area.address,
          radius: req.body.area.radius,
          lat: req.body.area.lat,
          lng: req.body.area.lng,
      });

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
