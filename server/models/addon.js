'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Addon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product)
    }
  };
  Addon.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    secondaryPrice: DataTypes.FLOAT,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Addon',
  });
  return Addon;
};