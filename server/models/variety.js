'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variety extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product)
    }
  };
  Variety.init({
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    shipping: DataTypes.FLOAT,
    secondaryShipping: DataTypes.FLOAT,
    delivery: DataTypes.FLOAT,
    secondaryDelivery: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Variety',
  });
  return Variety;
};