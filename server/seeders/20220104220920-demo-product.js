'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'First Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Second Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Third Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fourth Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fifth Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sixth Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Seventh Product',
        category: 'cakesandcupcakes',
        custom: 0,
        description: 'This is my first product',
        processingTime: 1,
        automaticRenewal: 1,
        inventory: 25,
        weight: 2,
        personalizationPrompt: 'What\'s your name?',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};