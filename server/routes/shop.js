'use strict';

const UserController = require('../controllers/user'),
  MakeShopController = require('../controllers/shop'),
  ShopController = new MakeShopController(),
  MakeProductController = require('../controllers/product'),
  ProductController = new MakeProductController()

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/shop/create', async (req, res, next) => {
    try {
        let shop = await ShopController.create(req, res, next)
        //let product = await ProductController.create(req, res, shop)
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