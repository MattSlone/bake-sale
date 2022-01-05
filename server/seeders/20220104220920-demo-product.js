'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      name: 'First Product',
      category: 'cakes',
      custom: 0,
      description: 'This is my first product',
      processingTime: 1,
      automaticRenewal: 1,
      inventory: 25,
      personalizationPrompt: 'What\'s your name?',
      ShopId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};