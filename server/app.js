require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const Sequelize = require('sequelize')
const app = express();

const indexRouter = require('./routes/index.js')
const userRouter = require('./routes/user.js')

/* DATABASE */
const sequelize = new Sequelize('database_development', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: (...msg) => console.log(msg)
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

/* Don't worry about these */
app.use(express.static(path.join(__dirname, '../build')));

app.get('/test', function (req, res) {
 console.log("testing")
});

/* ROUTERS */
app.use('/', indexRouter);
app.use('/users', userRouter);

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});


app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))
