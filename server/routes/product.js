'use strict';

const UserController = require('../controllers/user'),
  MakeProductController = require('../controllers/product'),
  ProductController = new MakeProductController(),
  multer = require('multer'),
  upload = multer({ dest: "/uploads"}),
  path = require('path');

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/product/create', async (req, res, next) => {
    try {
      console.log(req.files)
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

  app.post('/api/product/images', upload.array('photos', 9), async (req, res, next) => {
    try {
      let response = await ProductController.addImages(req, res, next)
      res.send({
          error: req.flash('error'),
          success: true
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

  app.get('/api/uploads/:name', async (req, res, next) => {
    var options = {
      root: path.join(__dirname, '../../uploads'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    console.log(req.params.name)
    res.sendFile(fileName, options, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })
}