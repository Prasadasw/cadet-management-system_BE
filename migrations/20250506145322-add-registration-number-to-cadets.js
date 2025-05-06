'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Cadets', 'registrationNumber', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      defaultValue: 'REG-UNASSIGNED'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cadets', 'registrationNumber');
  }
};
