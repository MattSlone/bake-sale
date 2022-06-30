'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductImages', [
      { 
        name: 'test',
        path: '/uploads/3a5517608fcb9971aef031549e32ae8b',
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductId: 1
      },
      {
        name: 'test2',
        path: '/uploads/3a5517608fcb9971aef031549e32ae8b',
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductId: 2
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', null, {});
  }
};
