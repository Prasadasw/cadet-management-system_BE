'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cadet_mobile_submissions', {
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
      cadetName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileSubmission: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      mobileReturn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add a unique constraint to prevent duplicate entries for the same cadet on the same day
    // Using a different index name to avoid conflicts
    await queryInterface.addIndex('cadet_mobile_submissions', ['cadetId', 'date'], {
      unique: true,
      name: 'cadet_mobile_submissions_cadet_id_date_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cadet_mobile_submissions');
  }
};