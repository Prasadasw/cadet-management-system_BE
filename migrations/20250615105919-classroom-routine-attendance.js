'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classroom_routine_attendance', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      routineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classroom_routines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cadetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cadets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'present'
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add unique constraint
    await queryInterface.addConstraint('classroom_routine_attendance', {
      fields: ['routineId', 'cadetId'],
      type: 'unique',
      name: 'unique_routine_cadet'
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('classroom_routine_attendance', ['routineId']);
    await queryInterface.addIndex('classroom_routine_attendance', ['cadetId']);
    await queryInterface.addIndex('classroom_routine_attendance', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classroom_routine_attendance');
  }
};