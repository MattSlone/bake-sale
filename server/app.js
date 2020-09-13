require('dotenv').config()
const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path');
  passport = require('passport')
  session = require('express-session')
  flash = require('connect-flash')
  Sequelize = require('sequelize')
  app = express();

require('./config/passport')(passport)

console.log(process.env.EXPRESS_PORT)

var session = require("express-session");
// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

//const userRouter = require('./routes/user.js')

/* DATABASE */
const sequelize = new Sequelize('database_development', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  //logging: (...msg) => console.log(msg)
});

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

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Don't worry about these */
app.use(express.static(path.join(__dirname, '../build')));
/* ROUTERS */
require('./routes/user')(app, passport)

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});

app.listen(process.env.EXPRESS_PORT, () => console.log(`App listening at http://localhost:${process.env.EXPRESS_PORT}`))
