'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hostelattendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cadetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cadets', // This should match the actual table name in your database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Present', 'Absent', 'Medical Leave'),
        allowNull: false,
        defaultValue: 'Absent'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add a unique constraint on cadetId and date
    await queryInterface.addConstraint('hostelattendances', {
      fields: ['cadetId', 'date'],
      type: 'unique',
      name: 'unique_cadet_date'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hostelattendances');
  }
};
