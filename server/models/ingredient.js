'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Product = this.belongsToMany(models.Product, { as: 'products', through: "product_ingredient" })
    }
  };
  Ingredient.init({
    name: DataTypes.STRING,
    allergen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};