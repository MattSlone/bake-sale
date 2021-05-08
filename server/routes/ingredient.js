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
}