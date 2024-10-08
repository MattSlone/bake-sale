'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product)
      this.belongsTo(models.User)
      this.Value = this.hasMany(models.Value)
    }
  };
  Quote.init({
    price: DataTypes.FLOAT,
    fulfillment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Quote',
  });

  return Quote;
};