'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product)
      this.Field = this.hasMany(models.Field)
    }
  };
  Form.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Form',
  });
  return Form;
};