'use strict';

const UserController = require('../controllers/user'),
  MakeIngredientController = require('../controllers/ingredient'),
  IngredientController = new MakeIngredientController()

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/ingredients/create', async (req, res, next) => {
    try {
        let response = await IngredientController.create(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.post('/api/ingredients/update',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      console.log(req.body)
        let response = await IngredientController.update(req, res, next)
        res.send({
            success: response
        })
    }
    catch (err) {
      req.flash('error', err)
      res.redirect('/api/ingredients/update')

    }
  })

  app.get('/api/ingredients/update', async (req, res, next) => {
    try {
        res.send({
            error: req.flash('error'),
            success: false
        })
    }
    catch (err) {
      res.send({
        error: [err],
        success: false
      })
    }
  })

  app.get('/api/ingredients',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      console.log(req.body.query)
        let response = await IngredientController.list(req, res, next)
        res.send({
            error: req.flash('error'),
            success: response
        })
    }
    catch (err) {
      res.send({
        error: [err],
        success: false
    })
    }
  })
}