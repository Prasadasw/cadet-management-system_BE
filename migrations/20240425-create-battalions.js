'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('battalions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Seed the 4 battalions
    await queryInterface.bulkInsert('battalions', [
      { name: 'Shaurya', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shakti', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Agnibaaz', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Balidan', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('battalions');
  }
}; 