'use strict';

const UserController = require('../controllers/user'),
  MakeShopController = require('../controllers/shop'),
  ShopController = new MakeShopController()

module.exports = (app) => {

  app.get('/api/shop', async (req, res, next) => {
    try {
        let shop = await ShopController.read(req, res, next)
        res.send({
            error: req.flash('error'),
            ...(shop && { success: shop })
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/shop/stripe/create', async (req, res, next) => {
    try {
        let response = await ShopController.createStripeAccount(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/shop/stripe/checkDetailsSubmitted', async (req, res, next) => {
    try {
        let response = await ShopController.checkDetailsSubmitted(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/shop/create', async (req, res, next) => {
    try {
        let shop = await ShopController.create(req, res, next)
        res.send({
            error: req.flash('error'),
            success: shop
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/shop/update', async (req, res, next) => {
    try {
        let shop = await ShopController.update(req, res, next)
        res.send({
            error: req.flash('error'),
            success: shop
        })
    }
    catch (err) {
      next(err)
    }
  })

  /*app.get('/tenant/tickets', async (req, res, next) => {
    try {
      let tickets = await TicketController.list(req, res, next)
      res.send({ tickets: tickets })
    }
    catch (err) {
      next(err)
    }
  })*/
}