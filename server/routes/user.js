'use strict'

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

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/api',
    failureRedirect: '/api',
    failureFlash: true,
    successFlash: 'true'
  }))

  app.get('/register', (req, res, next) => {
    res.send({
      error: req.flash('error'),
      success: req.flash('success')
    })
  })


  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/api/register',
    failureRedirect: '/api/register',
    failureFlash: true,
    successFlash: 'true'
  }))

  app.get('/uploads/:image', async (req, res, next) => {
    res.sendFile(`./server/uploads/${req.params.image}`)
  })
}
