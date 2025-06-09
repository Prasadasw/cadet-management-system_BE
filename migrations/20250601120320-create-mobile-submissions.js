'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mobile_submissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cadetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cadets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      morningSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      eveningReturned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add composite unique constraint for cadetId and date
    await queryInterface.addIndex('mobile_submissions', {
      fields: ['cadetId', 'date'],
      unique: true,
      name: 'mobile_submissions_cadet_date_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mobile_submissions');
  }
};
