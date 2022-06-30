'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Shop)
    }
  };
  ShopStatus.init({
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ShopStatus',
  });

  return ShopStatus;
};