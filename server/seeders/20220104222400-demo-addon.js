'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Addons', [{
      name: 'Addon 1',
      price: 0.5,
      secondaryPrice: 0,
      ProductId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Addons', null, {});
  }
};