'use strict';

const UserController = require('../controllers/user'),
  MakeProductController = require('../controllers/product'),
  ProductController = new MakeProductController()

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/product/create', async (req, res, next) => {
    try {
        let response = await ProductController.create(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.get('/api/products', async (req, res, next) => {
    try {
        let response = await ProductController.list(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.get('/api/products/count', async (req, res, next) => {
    try {
        let response = await ProductController.count(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.get('/api/product/deliverycost', async (req, res, next) => {
    try {
      let response = await ProductController.getDeliveryByTheMileCost(
        req.user,
        req.query.productId,
        req.query.quantity
      )
      res.send({
          error: req.flash('error'),
          success: response
      })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/product/update', async (req, res, next) => {
    try {
        let product = await ProductController.update(req, res, next)
        res.send({
            error: req.flash('error'),
            success: product
        })
    }
    catch (err) {
      next(err)
    }
  })
}