'use strict';

var LocalStrategy = require('passport-local').Strategy,
    models  = require('../models/index'),
    User = models.User

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user, err) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(new Error('user not found'));
      }
      done(null, user);
    })
  });

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  async function(req, username, password, done) {
    try {
      try {
        const [user, created] = await User.findOrCreate({
          where: { username: username },
          defaults: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street,
            street2: req.body.street2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            lat: req.body.lat,
            lng: req.body.lng,
            seller: req.body.seller,
            email: username,
            active: 1,
            password: await User.generateHash(password),
          }
        });
  
        if (!created) {
          return done(null, false, { message: 'Account already exists.' });
        }
        return done(null, user);
      } catch (err) {
        console.log(err)
      }
    } catch(err) {
      return done(err);
    }
  }));

  passport.use('local', new LocalStrategy(
  async function(username, password, done) {
    try {
      let user = await User.findOne({ where: { username: username } });
      if (!user) {
        return done(null, false, { message: 'User does not exist.' }); // code 4 (user doesn't exist)
      }
      let valid = await user.validPassword(password);
      if(!valid) {
        console.log('invalid password yo')
        return done(null, false, { message: 'Incorrect password.' }); // code 5 (incorrect password)
      }
      console.log('good to go: ', user.id)
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  }));
};
