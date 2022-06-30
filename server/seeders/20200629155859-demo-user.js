'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'slonem01@gmail.com',
      email: 'slonem01@gmail.com',
      password: '$2a$10$ANJPNBK3oNKvv2cm/rKLNOqOrDJLp3FA0WKZeZakhkx0l1LldkITK', // abc123456
      firstName: 'Matthew',
      lastName: 'Slone',
      street: '2065 Racimo Drive',
      city: 'Sarasota',
      state: 'Florida',
      zipcode: '34240',
      lat: 27.351,
      lng: -82.4222,
      seller: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
