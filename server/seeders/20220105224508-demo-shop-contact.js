'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Varieties', [{
      quantity: 1,
      price: 5,
      shipping: 1,
      secondaryShipping: 0.5,
      deliveryFeeType: 'flat',
      delivery: 3,
      secondaryDelivery: 0,
      ProductId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Varieties', null, {});
  }
};