'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PickupAddresses', [{
      street: '2065 Racimo Drive',
      city: 'Sarasota',
      state: 'FL',
      zipcode: '34240',
      ShopId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PickupAddresses', null, {});
  }
};