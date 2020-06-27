const { Sequelize } = require('sequelize');
const path = require('path')

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, './database.sqlite'),
  logging: (...msg) => console.log(msg)
});

const db = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = db
