'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ShopStatuses', [
      { 
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ShopStatuses', null, {});
  }
};
