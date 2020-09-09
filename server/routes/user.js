'use strict'
let multer = require('multer');
let upload = multer();

module.exports = (app, passport) => {
  app.get('/', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.flash('success')
    })
  })

  app.get('/logout', (req, res, next) => {
    req.logout()
    req.flash('success', 'Successfully logged out')
    res.redirect('/api')
  })

  app.post('/login', passport.authenticate('local'),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });

  app.get('/register', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.flash('success')
    })
  })


  app.post('/register', passport.authenticate('local-signup'), (req, res) => {
    res.send(req.user)
  })

/* DEBUGGER
  app.post('/register',
    // wrap passport.authenticate call in a middleware function
    function (req, res, next) {
      console.log('Request:', req.body)
      // call passport authentication passing the "local" strategy name and a callback function
      passport.authenticate('local', function (error, user, info) {
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
    });
*/

  app.get('/uploads/:image', async (req, res, next) => {
    res.sendFile(`./server/uploads/${req.params.image}`)
  })
}
