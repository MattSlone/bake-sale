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
        this.belongsTo(models.Shop)
        this.Product = this.belongsToMany(models.Product, { through: "product_order" })
    }
  };
  Order.init({
    amount: DataTypes.FLOAT,
    stripeCharge: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};