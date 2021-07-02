'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Constraint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Field)
    }
  };
  Constraint.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Constraint',
  });
  return Constraint;
};