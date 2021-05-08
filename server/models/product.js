'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Shop)
        this.belongsToMany(models.Ingredient, {through: models.ProductIngredient})
    }
  };
  Product.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    automaticRenewal: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};