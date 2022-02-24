'use strict';

const MakeOrderController = require('../controllers/order'),
  OrderController = new MakeOrderController()

module.exports = (app) => {
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
}