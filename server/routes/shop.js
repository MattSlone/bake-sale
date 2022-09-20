'use strict';

const UserController = require('../controllers/user'),
  ShopController = require('../controllers/shop')

module.exports = (app) => {

  app.get('/api/shop', async (req, res, next) => {
    try {
        let shop = await (new ShopController).read(req, res, next)
        res.send({
            error: req.flash('error'),
            ...(shop && { success: shop })
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/shop/stripe/create',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
        let response = await (new ShopController).createStripeAccount(req, res, next)
        if (response) {
          res.send({
            success: response
          })
        }
    }
    catch (err) {
      req.flash('error', err)
      res.redirect('/api/shop/stripe/create')
    }
  })

  app.get('/api/shop/stripe/create',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      res.send({
        error: req.flash('error')
      })
    }
    catch (err) {
      console.log(err)
    }
  })

  app.post('/api/shop/stripe/checkDetailsSubmitted',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      let response = await (new ShopController).checkDetailsSubmitted(req, res, next)
      res.send({
        error: req.flash('error'),
        success: response
      })
    }
    catch (err) {
      res.send({
        error: req.flash('error'),
        success: false
    })
    }
  })

  app.get('/api/shop/validateName',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      const nameAlreadyExists = await (new ShopController).nameAlreadyExists(
        req.query.name,
        req.user.id
      )
      res.send({
        error: !!nameAlreadyExists
      })
    } catch (err) {
      req.flash('error', err.message)
      res.redirect('/api/shop/error')
    }
  })

  app.post('/api/shop/create',
  UserController.isLoggedIn,
  ShopController.validateCreateOrEditShop,
  async (req, res, next) => {
    try {
      let shop = await (new ShopController).create(req, res, next)
      res.send({
          success: shop
      })
    }
    catch (err) {
      req.flash('error', err)
      res.redirect('/api/shop/create')
    }
  })

  app.get('/api/shop/create', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.get('/api/shop/error', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.post('/api/shop/update',
  UserController.isLoggedIn,
  ShopController.validateCreateOrEditShop,
  async (req, res, next) => {
    try {
      let shop = await (new ShopController).update(req, res, next)
      res.send({
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