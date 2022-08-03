'use strict'
require('dotenv').config()
const UserController = require('../controllers/user'),
  GMaps = require('../lib/gmaps')

module.exports = (app, passport) => {
  app.get('/api/signin', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.get('/api/signup', (req, res, next) => {
    res.send({
      error: req.flash('error'),
    })
  })

  app.post('/api/user/edit',
  UserController.isLoggedIn,
  UserController.validateEditUser, 
  async (req, res, next) => {
    const user = await (new UserController).update(req, res, next)
    res.send({
      success: user
    })
  })

  app.get('/api/user/edit', (req, res, next) => {
    res.send({
      error: req.flash('error')
    })
  })

  app.post('/api/user/address/components',
  UserController.verifyReCaptcha,
  async (req, res, next) => {
    const addressComponents = await GMaps.getFormattedAddress(req.body)
    console.log(addressComponents)
    if (typeof addressComponents == 'string') {
      req.flash('error', 'There was an issue validating your address.')
      res.redirect('/api/user/error')
      return
    }
    res.send({
      success: addressComponents
    })
  })

  app.get('/api/user/address/components', (req, res, next) => {
    res.send({
      error: req.flash('error')
    })
  })

  app.get('/api/user/error', (req, res, next) => {
    res.send({
      error: req.flash('error')
    })
  })

  app.get('/api/signout', (req, res, next) => {
    req.logout()
    res.json({ message: 'Successfully signed out' });
  })

  app.post('/api/signin',
  UserController.validateSignIn,
  passport.authenticate('local', { failureRedirect: '/api/signin', failureFlash: true}),
  async (req, res) => {
    res.send({
      error: false,
      success: req.user
    })
  })

  app.get('/api/signin', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.get('/api/user/error', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.post('/api/signup',
  UserController.validateSignUp,
  passport.authenticate('local-signup', { failureRedirect: '/api/user/error',failureFlash: true }),
  async (req, res) => {
    try {
      await (new UserController).sendSignUpEmail(req)
      req.logout()
      res.send({
        error: false,
        success: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.post("/api/forgotpassword",
  UserController.validateForgotPassword,
  async (req, res, next) => {
    try {
      await (new UserController).forgotPassword(req, res, next)
      res.send({
        success: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.get('/api/forgotpassword', (req, res, next) => {
    res.send({
      error: req.flash('error'),
    })
  })

  app.get('/api/user',
  UserController.isLoggedIn,
  async (req, res, next) => {
    try {
      let user = await (new UserController).read(req, res, next)
      res.send({
        success: user
      })
    } catch (err) {
      req.flash('error', err)
      res.redirect('api/user/error')
    }
  })

  app.post("/api/resetpassword",
  UserController.validateResetPassword,
  async (req, res, next) => {
    try {
      await (new UserController).resetPassword(req, res, next)
      res.send({
        success: true
      })
    } catch (err) {
      console.log(err)
      res.send({
        error: err,
        success: false
      })
    }
  })

  app.get('/api/resetpassword', (req, res, next) => {
    res.send({
      error: req.flash('error'),
    })
  })

/* DEBUGGER
  app.post('/api/signup',
    // wrap passport.authenticate call in a middleware function
    function (req, res, next) {
      console.log('Request:', req.body)
      // call passport authentication passing the "local" strategy name and a callback function
      passport.authenticate('local-signup', function (error, user, info) {
        // this will execute in any case, even if a passport strategy will find an error
        // log everything to console
        console.log(error);
        console.log(user);
        console.log(info);

        if (error) {
          res.status(401).send(error);
        } else if (!user) {
          res.status(401).send(info);
        } else {
          next();
        }

        res.status(401).send(info);
      })(req, res);
    },
    // function to call once successfully authenticated
    function (req, res) {
      res.status(200).send('logged in!');
    }
  );
*/
}
