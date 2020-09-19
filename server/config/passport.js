'use strict';

var LocalStrategy = require('passport-local').Strategy,
    models  = require('../models/index'),
    User = models.User

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findByPk(id)
      done(null, user);
    } catch (err) {
      done(err)
    }
  });

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  async function(req, username, password, done) {
    try {
      const [user, created] = await User.findOrCreate({
        where: { username: username },
        defaults: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          seller: req.body.seller,
          email: username,
          password: await User.generateHash(password),
        }
      });

      if (!created) {
        return done(null, false, { message: 'Username taken.' });
      }
      return done(null, user);
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
        return done(null, false, { message: 'Incorrect password.' }); // code 5 (incorrect password)
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  }));
};
