'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User)
        this.belongsTo(models.Variety)
        this.belongsTo(models.Transfer)
        this.belongsTo(models.Product)
        this.FulfillmentAddress = this.belongsTo(models.FulfillmentAddress)
        this.Addon = this.belongsToMany(models.Addon, { through: "order_addon" })
    }
  };
  Order.init({
    productPrice: DataTypes.FLOAT,
    fulfillmentPrice: DataTypes.FLOAT,
    secondaryFulfillmentPrice: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    processingTime: DataTypes.INTEGER,
    fulfillment: DataTypes.STRING,
    personalization: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};