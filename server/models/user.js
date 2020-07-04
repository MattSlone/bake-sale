'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async generateHash(password) {
      try {
        let hash = await bcrypt.hash(password, 10)
        return hash;
      } catch(err) {
        return err;
      }
    }

    async validPassword(password) {
      try {
        let res = await bcrypt.compare(password, this.password);
        return res;
      } catch(err) {
        return err;
      }
    }

  };
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  console.log(User)
  return User;
};
