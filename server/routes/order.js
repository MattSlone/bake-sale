'use strict';

const MakeOrderController = require('../controllers/order'),
  OrderController = new MakeOrderController()

module.exports = (app, webhookApp) => {
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
  webhookApp.post('/webhook',  async (req, res, next) => {
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