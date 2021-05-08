'use strict'

const db = require('../models/index')

module.exports = class ShopController {
    async create (req, res, next) {
        try {
            const shop = await db.Shop.create({
                name: req.body.name,
                state: req.body.state,
                UserId: req.body.userId
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
