'use strict'

const User = require('../models/user'),
  db = require('../models/index')

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

  async read (req, res, next) {
    try {
      let user = await db.User.findOne({ where: { id: req.query.UserId } })
      return user
    } catch (err) {

    }
  }
}
