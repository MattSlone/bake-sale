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
      this.PickupSchedule = this.hasOne(models.PickupSchedule)
      this.ShopContact = this.hasOne(models.ShopContact)
      this.Product = this.hasMany(models.Product)
    }
  };
  Shop.init({
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    location: DataTypes.STRING,
    radius: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    allowPickups: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};
