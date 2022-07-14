'use strict';

const UserController = require('../controllers/user'),
  MakeProductController = require('../controllers/product'),
  ProductController = new MakeProductController(),
  multer = require('multer'),
  upload = multer({
    dest: "/uploads",
    fileFilter: function(_req, file, cb){
      checkFileType(_req, file, cb);
    }
  }),
  path = require('path');

function checkFileType(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype){
    return cb(null,true);
  } else {
    req.fileValidationError = true
    return cb(null, true);
  }
}

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/product/create',
  UserController.isLoggedIn,
  MakeProductController.validateCreateOrEditProduct,
  async (req, res, next) => {
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

  app.get('/api/product/error', async (req, res, next) => {
    console.log(req.error)
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.post('/api/product/images',
  UserController.isLoggedIn,
  upload.array('photos', 9),
  async (req, res, next) => {
    try {
      if (req.fileValidationError) {
        req.flash('error', 'There was a problem uploading product images.')
        res.redirect('/api/product/error')
      } else {
        await ProductController.addImages(req, res, next)
        res.send({
          success: true
        })
      }
    }
    catch (err) {
      console.log(err)
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

  app.post('/api/product/update',
  MakeProductController.validateCreateOrEditProduct,
  async (req, res, next) => {
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
    res.sendFile(fileName, options, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })
}