const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

// Enhanced logging function
const customLogger = (msg) => {
  console.log(`[Sequelize] ${msg}`);
};

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  {
    host: config.host,
    dialect: config.dialect,
    logging: customLogger,
    pool: {
      max: 5,        // Maximum number of connection in pool
      min: 0,        // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000    // The maximum time, in milliseconds, that a connection can be idle before being released
    },
    define: {
      timestamps: true,
      underscored: true,  // Use snake_case for automatically added attributes
      freezeTableName: true  // Prevent sequelize from pluralizing table names
    },
    dialectOptions: {
      // Additional MySQL-specific options
      connectTimeout: 10000  // Connection timeout in milliseconds
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Call connection test
testConnection();

module.exports = sequelize;
