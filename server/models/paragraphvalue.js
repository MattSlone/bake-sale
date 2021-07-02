'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParagraphValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Field)
    }
  };
  ParagraphValue.init({
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ParagraphValue',
  });
  return ParagraphValue;
};