'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shops', [{
      name: 'Test Shop',
      state: 'FL',
      location: '2065 Racimo Drive',
      radius: 10959,
      lat: 27.351,
      lng: -82.4222,
      allowPickups: 1,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shops', null, {});
  }
};