'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PickupSchedules', [
      {
        day: 'Sunday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Monday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Tuesday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Wednesday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Thursday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Friday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Saturday',
        start: '12:00',
        end: '12:00',
        ShopId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PickupSchedules', null, {});
  }
};