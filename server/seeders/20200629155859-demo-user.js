'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'John Doe',
      email: 'example@example.com',
      password: '$2a$10$ANJPNBK3oNKvv2cm/rKLNOqOrDJLp3FA0WKZeZakhkx0l1LldkITK', // abc123456
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
