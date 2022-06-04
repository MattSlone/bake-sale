'use strict'
require('dotenv').config()
const User = require('../models/user'),
  db = require('../models/index'),
  Email = require('email-templates'),
  nodemailer = require('nodemailer'),
  jwt = require('jsonwebtoken')

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
        const token = jwt.sign(data, process.env.JWT_SECRET_KEY);
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
}
