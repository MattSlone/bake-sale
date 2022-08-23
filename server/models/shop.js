'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User)
      this.PickupAddress = this.hasOne(models.PickupAddress)
      this.PickupSchedule = this.hasMany(models.PickupSchedule)
      this.ShopContact = this.hasOne(models.ShopContact)
      this.Product = this.hasMany(models.Product)
    }
  };
  Shop.init({
    name: DataTypes.STRING,
    uri: DataTypes.STRING,
    allowPickups: DataTypes.BOOLEAN,
    stripeAccountId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};
