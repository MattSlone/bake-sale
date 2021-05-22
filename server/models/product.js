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
    }
  };
  Product.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    automaticRenewal: DataTypes.BOOLEAN,
    inventory: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};