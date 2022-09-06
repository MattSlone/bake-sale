const express = require('express'),
  path = require('path'),
  passport = require('passport'),
  session = require('express-session'),
  flash = require('connect-flash'),
  app = express(),
  env = require('./config/environment')

const { Sequelize } = require('sequelize')

require('./lib/passport')(passport)

if (env.nodeEnv === 'production') {
  app.set('trust proxy', true)
}

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

/* DATABASE */
const sequelize = new Sequelize(env.db.name, env.db.username, env.db.password, {
  host: 'db',
  dialect: 'mysql',
  retry: {
    match: [
      Sequelize.ConnectionError,
      Sequelize.ConnectionTimedOutError,
      Sequelize.TimeoutError,
      /Deadlock/i
    ],
    max: 3
  }
});

/* Session stuff for cookies and passwords */
var myStore = new SequelizeStore({
  db: sequelize,
});

sequelize.define("Session", {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  }
});

app.use(
  session({
    secret: "keyboard cat",
    store: myStore,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.,
    saveUninitialized: false
  })
);
myStore.sync();

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json({limit: '50mb'})(req, res, next)
  }
})

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.urlencoded({ extended: true, limit: '50mb' })(req, res, next)
  }
})

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../uploads')))

/* ROUTERS */
require('./routes/user')(app, passport)
require('./routes/shop')(app)
require('./routes/product')(app)
require('./routes/ingredient')(app)
require('./routes/quote')(app)
require('./routes/order')(app, express)

if (env.nodeEnv === 'production') {
  const root = require('path').join('/public')
  app.use(express.static(root));
  app.get("*", (req, res) => {
      res.sendFile('index.html', { root });
  })
}

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});

app.listen(env.expressPort, () => console.log(`App listening at http://server:${env.expressPort}`))