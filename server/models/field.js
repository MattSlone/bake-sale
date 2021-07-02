'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Form)
      this.Value = this.hasOne(models.Value)
      this.ParagraphValue = this.hasOne(models.ParagraphValue)
      this.Option = this.hasMany(models.Option)
      this.Constraint = this.hasMany(models.Constraint)
    }
  };
  Field.init({
    name: DataTypes.STRING,
    prompt: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Field',
  });
  return Field;
};