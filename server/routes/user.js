'use strict'
require('dotenv').config()
const MakeUserController = require('../controllers/user'),
  UserController = new MakeUserController()

module.exports = (app, passport) => {
  app.get('/api/signin', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: false
    })
  })

  app.get('/api/user', async (req, res, next) => {
    try {
      let user = await UserController.read(req, res, next)
      res.send({
        error: req.flash('error'),
        success: user
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.get('/api/signup', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.user
    })
  })

  app.post('/api/user/edit', async (req, res, next) => {
    const user = await UserController.update(req, res, next)
    res.send({
      error: req.flash('error'),
      success: user
    })
  })

  app.get('/api/signout', (req, res, next) => {
    req.logout()
    res.json({ message: 'Successfully signed out' });
  })

  app.post('/api/signin', passport.authenticate('local', { failureRedirect: '/api/signin', failureFlash: true}),
  async (req, res) => {
    res.send({
      error: false,
      success: req.user
    })
  })
  
  app.post('/api/signup', passport.authenticate('local-signup', { failureRedirect: '/api/signup',failureFlash: true }),
  async (req, res) => {
    try {
      await UserController.sendSignUpEmail(req)
      res.send({
        error: false,
        success: req.user
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.post("/api/forgotpassword", async (req, res, next) => {
    try {
      await UserController.forgotPassword(req, res, next)
      res.send({
        error: req.flash('error'),
        success: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.post("/api/resetpassword", async (req, res, next) => {
    try {
      console.log('in route')
      await UserController.resetPassword(req, res, next)
      res.send({
        error: req.flash('error'),
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
