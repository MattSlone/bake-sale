'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Order)
        this.belongsTo(models.Shop)
    }
  };
  Transfer.init({
    amount: DataTypes.FLOAT,
    stripeTransferId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transfer',
  });

  return Transfer;
};