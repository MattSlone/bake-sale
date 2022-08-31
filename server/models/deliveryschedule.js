'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliverySchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Shop)
    }
  };
  DeliverySchedule.init({
    Sunday: DataTypes.BOOLEAN,
    Monday: DataTypes.BOOLEAN,
    Tuesday: DataTypes.BOOLEAN,
    Wednesday: DataTypes.BOOLEAN,
    Thursday: DataTypes.BOOLEAN,
    Friday: DataTypes.BOOLEAN,
    Saturday: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DeliverySchedule',
  });
  return DeliverySchedule;
};