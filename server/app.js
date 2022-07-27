const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  passport = require('passport'),
  session = require('express-session'),
  flash = require('connect-flash'),
  app = express(),
  webhookApp = express(),
  env = require('./config/environment')

const { Sequelize, Transaction } = require('sequelize')

require('./lib/passport')(passport)

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

/* DATABASE */
const sequelize = new Sequelize(env.db.name, env.db.username, env.db.password, {
  host: 'db',
  dialect: 'mysql',
  //isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
  //logging: (...msg) => console.log(msg)
});

/*sequelize.getQueryInterface().describeTable('Shops').then((tableObj) => {
    console.log('// Tables in database','==========================');
    console.log(tableObj);
})
.catch((err) => {
    console.log('showAllSchemas ERROR',err);
})*/

/*(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()*/

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

app.use(express.json({limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
webhookApp.use(express.raw({ type: 'application/json' }))

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../uploads')))

/* ROUTERS */
require('./routes/user')(app, passport)
require('./routes/shop')(app)
require('./routes/product')(app)
require('./routes/ingredient')(app)
require('./routes/quote')(app)
require('./routes/order')(app, webhookApp)

const root = require('path').join('/public')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});

app.listen(env.expressPort, () => console.log(`App listening at http://server:${env.expressPort}`))
webhookApp.listen(env.stripeWebhookPort, () => console.log(`Webhook App listening at http://server:${env.stripeWebhookPort}`))