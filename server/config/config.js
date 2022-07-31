const env = require('./environment')

module.exports = {
  development: {
    "username": env.db.username,
    "password": env.db.password,
    "database": env.db.name,
    "host": "db",
    "dialect": "mysql"
  },
  test: {
    "username": "root",
    "password":"root",
    "database": "database_test",
    "host": "db",
    "dialect": "mysql"
  },
  production: {
    "username": env.db.username,
    "password": env.db.password,
    "database": env.db.name,
    "host": "db",
    "dialect": "mysql"
  }
}