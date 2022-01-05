'use strict'

const db = require('../models/index')

module.exports = class QuoteController {
    async create (req, res, next) {
        try {

          const quote = await db.Quote.create({
            status: req.body.status,
            ProductId: req.body.productId,
            Values: req.body.values
          }, {
            include: [
              db.Product,
              db.Value
            ]
          })
          return quote
        }
        catch (err) {
            return next(err)
        }
    }

    async list(req, res, next) {
      try {
        console.log(req.body)
          const quotes = db.Quote.findAll({
              where: {
                  ProductId: req.query.product
              },
              include: [
                db.Product
              ]
          });
          return quotes
      }
      catch(err) {
          return err
      }
  }
}
