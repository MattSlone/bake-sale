'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('OrderStatuses', [
      { 
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderStatuses', null, {});
  }
};
