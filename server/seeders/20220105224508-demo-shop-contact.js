'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ShopContacts', [{
      phone: 1234567890,
      email: 'example@example.com',
      ShopId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ShopContacts', null, {});
  }
};