'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('QuoteStatuses', [
      { 
        status: 'requested',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'quoted',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('QuoteStatuses', null, {});
  }
};
