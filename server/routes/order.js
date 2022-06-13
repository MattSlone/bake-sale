'use strict';

const MakeOrderController = require('../controllers/order'),
  OrderController = new MakeOrderController()

module.exports = (app, webhookApp) => {
  app.get('/api/orders', async (req, res, next) => {
    try {
      console.log('inside routeeee!')
      if (req.user) {
        console.log('user is logged in!!!')
        let response = await OrderController.list(req, res, next)
        console.log('RESPONSEEEEE: ', response)
        res.send({
          error: req.flash('error'),
          success: response
        })
      } else {
        res.send({
          error: req.flash('Not Logged In'),
          success: false
        })
      }
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/order/intent', async (req, res, next) => {
    try {
        let response = await OrderController.createPaymentIntent(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })
  
  webhookApp.post('/webhook', async (req, res, next) => {
    try {
      const response = await OrderController.handleStripeWebhooks(req, res, next)
      res.send(response)
    }
    catch (err) {
      console.log(err)
      next(err)
    }
  });
}