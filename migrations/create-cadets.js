'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cadets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chestNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      battalionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hostelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      roomNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      schoolDetails: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parentsDetails: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parentContactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emailId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobileSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      initialPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      batchYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: new Date().getFullYear()
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
  },

  down: async (queryInterface, Sequelize) => {
    // First remove any foreign key constraints
    try {
      await queryInterface.removeConstraint('Cadets', 'cadets_battalionId_fkey');
    } catch (error) {
      console.log('No battalion foreign key constraint found');
    }
    try {
      await queryInterface.removeConstraint('Cadets', 'cadets_hostelId_fkey');
    } catch (error) {
      console.log('No hostel foreign key constraint found');
    }
    // Then drop the table
    await queryInterface.dropTable('Cadets');
  }
};
