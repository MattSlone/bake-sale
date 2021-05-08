'use strict'

const User = require('../models/user')

module.exports = class UserController {
  /* static async isAdmin (req, res, next) {
    try {
      if (req.user.admin) {
        next()
      }
      else {
        req.flash('error', 'User does not have required permissions.')
        res.redirect('/api')
      }
    }
    catch (err) {
      next(err)
    }
  } */

  static isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      next()
    }
    else {
      req.flash('error', 'Not logged in.')
      res.redirect('/api')
    }
  }
}
