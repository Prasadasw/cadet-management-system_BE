'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classroom_cadets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      classroomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classrooms',
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
      academicYear: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'transferred', 'graduated', 'withdrawn'),
        defaultValue: 'active'
      },
      joinedDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      leftDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
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

    // Add unique constraint on classroomId, cadetId, and academicYear
    await queryInterface.addIndex('classroom_cadets', 
      ['classroomId', 'cadetId', 'academicYear'],
      {
        unique: true,
        name: 'unique_classroom_cadet_year'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classroom_cadets');
  }
};
