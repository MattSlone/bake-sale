'use strict'
require('dotenv').config()
const GMaps = require('../lib/gmaps')
const User = require('../models/user'),
  db = require('../models/index'),
  Email = require('email-templates'),
  nodemailer = require('nodemailer'),
  jwt = require('jsonwebtoken'),
  validator = require('validator')

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
      res.redirect('/api/signin')
    }
  }

  async read (req, res, next) {
    try {
      let user = await db.User.findOne({ where: { id: req.query.UserId } })
      return user
    } catch (err) {

    }
  }

  async sendSignUpEmail (req) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
      const email = new Email({
        message: {
          from: process.env.EMAIL
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter
      });
      
      await email.send({
        template: 'signup',
        message: {
          to: 'slonem01@gmail.com'
        },
        locals: {
          name: 'Matthew Slone'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  async forgotPassword (req) {
    try {
      const user = await db.User.findOne({ where: { username: req.body.email } })
      if (user) {
        console.log(req.body.email, user.id)
        let data = {
          time: Date(),
          userId: user.id,
        }
        const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
          expiresIn: '15m'
        });
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
          }
        });
        const email = new Email({
          message: {
            from: process.env.EMAIL
          },
          // uncomment below to send emails in development/test env:
          send: true,
          transport: transporter
        });
        
        await email.send({
          template: 'forgotpassword',
          message: {
            to: req.body.email
          },
          locals: {
            token: token,
            name: user.firstName
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  async resetPassword (req) {
    try {
      const token = req.body.token;
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (verified) {
        console.log('TOKEN DATA: ', verified)
        const user = await db.User.findByPk(verified.userId)
        const hashedPassword = await db.User.generateHash(req.body.password)
        user.password = hashedPassword
        await user.save()
      }
    } catch (err) {
      console.log(err)
    }
  }

  async update (req, res, next) {
    try {
      const update = {
        ...(req.body.firstName && { firstName: req.body.firstName }),
        ...(req.body.lastName && { lastName: req.body.lastName }),
        ...(req.body.street && { street: req.body.street }),
        ...(req.body.city && { city: req.body.city }),
        ...(req.body.state && { state: req.body.state }),
        ...(req.body.zipcode && { zipcode: req.body.zipcode }),
        ...('seller' in req.body && { seller: req.body.seller }),
        ...(req.body.username && { username: req.body.username }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.newPassword && req.user.validPassword(req.body.password) 
          && {
            password: await db.User.generateHash(req.body.newPassword)
          }
        )
      }
      await db.User.update(update, { where: { id: req.user.id } });
      const user = await db.User.findOne({ 
        where: { id: req.user.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      })
      return user
    }
    catch (err) {
      return next(err)
    }
  }

  static async validateSignIn(req, res, next) {
    try {
      for (const field of [
        { name: 'Email', value: req.body.username },
        { name: 'Password', value: req.body.password }
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/signin')
          return
        }
      }
      if (!validator.isEmail(req.body.username)) {
        req.flash('error', "Invalid email address.")
        res.redirect('/api/signin')
        return
      }
      if (!validator.isByteLength(req.body.password, { min: 5, max: 15 })) {
        req.flash('error', "Password should be between 5 and 15 characters.")
        res.redirect('/api/signin')
        return
      }
      next()
    } catch (err) {
      console.log(err)
      req.flash('error', "There was a problem signing in.")
      res.redirect('/api/signin')
    }
  }

  static async validateSignUp(req, res, next) {
    try {
      const addressComponents = await GMaps.getFormattedAddress(req)
      if (typeof addressComponents == 'string') {
        req.flash('error', 'There was an issue validating your address.')
        res.redirect('/api/signup')
        return
      }
      for (const field of [
        { name: 'First name', value: req.body.firstName },
        { name: 'Last name', value: req.body.lastName },
        { name: 'Street', value: req.body.street },
        { name: 'City', value: req.body.city },
        { name: 'State', value: req.body.state },
        { name: 'Zipcode', value: req.body.zipcode },
        { name: 'Email', value: req.body.username },
        { name: 'Password', value: req.body.password }
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/signup')
          return
        }
      }
      if (!validator.isEmail(req.body.username)) {
        req.flash('error', 'Invalid email address')
        res.redirect('/api/signup')
        return
      }
      if (
        !(req.body.firstName && validator.isAlpha(req.body.firstName)) 
        || !(req.body.lastName && validator.isAlpha(req.body.lastName))
      ) {
        req.flash('error', 'Name may only contain letters.')
        res.redirect('/api/signup')
        return
      }
      if (!validator.isByteLength(req.body.password, { min: 5, max: 15 })) {
        req.flash('error', "Password should be between 5 and 15 characters.")
        res.redirect('/api/signup')
        return
      }
      next()
    } catch (err) {
      req.flash('error', "There was an error signing up.")
      res.redirect('/api/signup')
    }
  }

  static async validateEditUser(req, res, next) {
    try {
      if (req.body.username) {
        await UserController.validateEditAccount(req, res, next)
        return
      }
      const addressComponents = await GMaps.getFormattedAddress(req)
      if (typeof addressComponents == 'string') {
        req.flash('error', 'There was an issue validating your address.')
        res.redirect('/api/user/edit')
        return
      }
      for (const field of [
        { name: 'First name', value: req.body.firstName },
        { name: 'Last name', value: req.body.lastName },
        { name: 'Street', value: req.body.street },
        { name: 'City', value: req.body.city },
        { name: 'State', value: req.body.state },
        { name: 'Zipcode', value: req.body.zipcode }
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/user/edit')
          return
        }
      }
      if (
        !(req.body.firstName && validator.isAlpha(req.body.firstName)) 
        || !(req.body.lastName && validator.isAlpha(req.body.lastName))
      ) {
        req.flash('error', 'Name may only contain letters.')
        res.redirect('/api/user/edit')
        return
      }
      next()
    } catch (err) {
      console.log(err)
      req.flash('error', "There was an error signing up.")
      res.redirect('/api/user/edit')
    }
  }

  static async validateEditAccount(req, res, next) {
    try {
      for (const field of [
        { name: 'Email', value: req.body.username },
        { name: 'Password', value: req.body.password }
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/user/edit')
          return
        }
      }
      if (!validator.isEmail(req.body.username)) {
        req.flash('error', 'Invalid email address')
        res.redirect('/api/user/edit')
        return
      }
      if (!validator.isByteLength(req.body.password, { min: 5, max: 15 })
        || !validator.isByteLength(req.body.newPassword, { min: 5, max: 15 })) {
        req.flash('error', "Password should be between 5 and 15 characters.")
        res.redirect('/api/user/edit')
        return
      }
      if (!(await req.user.validPassword(req.body.password))) {
        console.log('INVALID PASSWORDDDD')
        req.flash('error', "Invalid Password")
        res.redirect('/api/user/edit')
        return
      }
      next()
    } catch (err) {
      req.flash('error', "There was an error signing up.")
      res.redirect('/api/user/edit')
    }
  }

  static async validateForgotPassword(req, res, next) {
    try {
      for (const field of [
        { name: 'Email', value: req.body.email },
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/forgotpassword')
          return
        }
      }
      if (!validator.isEmail(req.body.email)) {
        req.flash('error', "Invalid email address.")
        res.redirect('/api/forgotpassword')
        return
      }
      next()
    } catch (err) {
      console.log(err)
      req.flash('error', "There was a problem validating your email.")
      res.redirect('/api/forgotpassword')
      return
    }
  }

  static async validateResetPassword(req, res, next) {
    try {
      for (const field of [
        { name: 'Password', value: req.body.password },
      ]) {
        if (!field.value) {
          req.flash('error', `${field.name} is required.`)
          res.redirect('/api/resetpassword')
          return
        }
      }
      if (!validator.isByteLength(req.body.password, { min: 5, max: 15 })) {
        req.flash('error', "Password should be between 5 and 15 characters.")
        res.redirect('/api/resetpassword')
        return
      }
      const token = req.body.token
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!verified) {
        req.flash('error', "Invalid token.")
        res.redirect('/api/resetpassword')
        return
      }
      next()
    } catch (err) {
      console.log(err)
      req.flash('error', "There was a problem resetting your password.")
      res.redirect('/api/resetpassword')
      return
    }
  }
}
