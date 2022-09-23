'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Varieties', [
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 5,
        price: 15,
        shipping: 3,
        secondaryShipping: 0.5,
        deliveryFeeType: 'flat',
        delivery: 5,
        secondaryDelivery: 0,
        ProductId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 1,
        price: 0,
        shipping: 1,
        secondaryShipping: 0.5,
        deliveryFeeType: 'mile',
        delivery: 3,
        secondaryDelivery: 0,
        ProductId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Varieties', null, {});
  }
};