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
        this.Ingredient = this.belongsToMany(models.Ingredient, { through: "product_ingredient" })
        this.Variety = this.hasMany(models.Variety)
        this.Addon = this.hasMany(models.Addon)
        this.Form = this.hasOne(models.Form)
        this.ProductImage = this.hasMany(models.ProductImage)
        this.Quote = this.hasMany(models.Quote)
    }
  };
  Product.init({
    name: DataTypes.STRING,
    published: DataTypes.BOOLEAN,
    category: DataTypes.STRING,
    custom: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    processingTime: DataTypes.INTEGER,
    automaticRenewal: DataTypes.BOOLEAN,
    inventory: DataTypes.INTEGER,
    personalizationPrompt: DataTypes.TEXT,
    weight: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};