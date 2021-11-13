'use strict';

const MakeQuoteController = require('../controllers/quote'),
  QuoteController = new MakeQuoteController()

module.exports = (app) => {
  /*app.get('/tenant', UserController.isLoggedIn, (req, res, next) => {
    res.send({ user: req.user })
  })*/

  app.post('/api/quote/create', async (req, res, next) => {
    try {
        let quote = await QuoteController.create(req, res, next)
        res.send({
            error: req.flash('error'),
            success: quote
        })
    }
    catch (err) {
      next(err)
    }
  })

  app.get('/api/quotes', async (req, res, next) => {
    try {
        let quotes = await QuoteController.list(req, res, next)
        res.send({
            error: req.flash('error'),
            success: quotes
        })
    }
    catch (err) {
      next(err)
    }
  })
}