'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Field)
      this.belongsTo(models.Quote)
    }
  };
  Value.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Value',
  });
  return Value;
};