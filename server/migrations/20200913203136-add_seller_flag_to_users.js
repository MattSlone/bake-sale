'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'seller', { type: Sequelize.BOOLEAN });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'seller', {});
  }
};
