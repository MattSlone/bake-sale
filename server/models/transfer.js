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
        this.belongsTo(models.Shop)
    }
  };
  Transfer.init({
    orderTotal: DataTypes.FLOAT,
    ourFee: DataTypes.FLOAT,
    stripeFee: DataTypes.FLOAT,
    payout: DataTypes.FLOAT,
    stripePaymentIntentId: DataTypes.STRING,
    stripeTransferId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transfer',
  });

  return Transfer;
};