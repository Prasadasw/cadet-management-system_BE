// migrations/YYYYMMDDHHMMSS-create-classroom-routine-attendance.js
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
      markedById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.addIndex('classroom_routine_attendance', ['markedById']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classroom_routine_attendance');
  }
};