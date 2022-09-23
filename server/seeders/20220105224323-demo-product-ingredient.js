'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('product_ingredient', [
      {
        IngredientId: 1,
        ProductId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        IngredientId: 1,
        ProductId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('product_ingredient', null, {});
  }
};