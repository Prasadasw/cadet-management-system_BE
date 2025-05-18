'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('cadets', 'collegeName', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('cadets', 'alternateMobileNumber', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('cadets', 'remark', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('cadets', 'collegeName'),
      queryInterface.removeColumn('cadets', 'alternateMobileNumber'),
      queryInterface.removeColumn('cadets', 'remark'),
    ]);
  }
};
