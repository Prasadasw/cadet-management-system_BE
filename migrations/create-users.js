'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create the table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Staff',
        validate: {
          isIn: [['Admin', 'Staff', 'Parent', 'HR']]
        }
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

    // Then insert the admin user in a separate step
    await queryInterface.bulkInsert('Users', [{
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$X7UrH5UxX5UxX5UxX5UxX.5UxX5UxX5UxX5UxX5UxX5UxX5UxX5UxX', // hashed 'admin123'
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
}; 