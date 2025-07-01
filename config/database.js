
// const { Sequelize } = require('sequelize');
// const env = process.env.NODE_ENV || 'development';
// const config = require('./config.json')[env];

// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     port: config.port,
//     dialect: config.dialect,
//     logging: console.log,
//     dialectOptions: {
//       ssl: config.dialectOptions?.ssl || false,
//       connectTimeout: 10000
//     }
//   }
// );

// sequelize.authenticate()
//   .then(() => console.log('✅ DB connected'))
//   .catch((err) => console.error('❌ DB connection error:', err));

// module.exports = sequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

// Use these correct variable names from .env
const username = process.env.DB_USERNAME || config.username;
const password = process.env.DB_PASSWORD || config.password;
const database = process.env.DB_NAME || config.database;
const host = process.env.DB_HOST || config.host;
const dialect = process.env.DB_DIALECT || config.dialect || 'mysql';
const port = process.env.DB_PORT || config.port || 3306;


const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: console.log,
  dialectOptions: {
    ssl: config.dialectOptions?.ssl || false,
    connectTimeout: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

module.exports = sequelize;
