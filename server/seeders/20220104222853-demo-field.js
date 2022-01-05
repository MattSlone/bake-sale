'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Fields', [{
      name: 'Test Field',
      prompt: 'Whats is your name?',
      type: 'text',
      FormId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Fields', null, {});
  }
};