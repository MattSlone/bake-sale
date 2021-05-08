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
}