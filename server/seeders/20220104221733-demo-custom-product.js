'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      name: 'Test Custom Product',
      category: 'glutenfree',
      custom: 1,
      description: 'Custom product description',
      processingTime: 1,
      automaticRenewal: 1,
      inventory: 0,
      personalizationPrompt: null,
      ShopId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};