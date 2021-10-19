'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      custom: {
        type: Sequelize.BOOLEAN
      },
      fields: {
        type: Sequelize.STRING
      },
      processingTime: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      automaticRenewal: {
        type: Sequelize.BOOLEAN
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      personalizationPrompt: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};