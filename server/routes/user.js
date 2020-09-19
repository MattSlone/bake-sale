'use strict'
let multer = require('multer');
let upload = multer();

module.exports = (app, passport) => {
  app.get('/api/signin', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.user
    })
  })

  app.get('/api/signup', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.user
    })
  })

  app.get('/api/signout', (req, res, next) => {
    req.logout()
    res.json({ message: 'Successfully signed out' });
  })

  app.post('/api/signin', passport.authenticate('local', { failureRedirect: '/api/signin', successRedirect: '/api/signin', failureFlash: true}))
  app.post('/api/signup', passport.authenticate('local-signup', { failureRedirect: '/api/signup', successRedirect: '/api/signup', failureFlash: true }))

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

  app.get('/uploads/:image', async (req, res, next) => {
    res.sendFile(`./server/uploads/${req.params.image}`)
  })
}
