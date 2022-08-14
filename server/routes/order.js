'use strict';

const UserController = require('../controllers/user');

const MakeOrderController = require('../controllers/order'),
  OrderController = new MakeOrderController()

module.exports = (app, webhookApp) => {
  app.get('/api/orders',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      let response = await OrderController.list(req, res, next)
      res.send({
        success: response
      })
    }
    catch (err) {
      console.log(err)
      req.flash('error', 'There was an erro getting orders')
      res.redirect('/api/order/error')
    }
  })

  app.post('/api/order/intent',
  UserController.isLoggedIn,
  MakeOrderController.validateCart,
  async (req, res, next) => {
    try {
      let response = await OrderController.createPaymentIntent(req, res, next)
      res.send({
          error: false,
          success: response
      })
    }
    catch (err) {
      req.flash('error', err)
      res.redirect('/api/order/error')
    }
  })

  app.get('/api/order/error', async (req, res, next) => {
    try {
      res.send({
          error: req.flash('error'),
          success: false
      })
    }
    catch (err) {
      console.log(err)
    }
  })
  
  webhookApp.post('/webhook', async (req, res, next) => {
    try {
      const response = await OrderController.handleStripeWebhooks(req, res, next)
      res.sendStatus(response)
    }
    catch (err) {
      console.log(err)
      next(err)
    }
  });
}