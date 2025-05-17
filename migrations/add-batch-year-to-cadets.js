'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cadets', 'batchYear', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear()
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cadets', 'batchYear');
  }
}; 