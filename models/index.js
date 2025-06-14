'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Dynamically import each model file
    const modelModule = require(path.join(__dirname, file));
    
    console.log(`Processing model file: ${file}`);
    console.log(`Module type: ${typeof modelModule}`);
    console.log(`Module keys: ${Object.keys(modelModule)}`);
    
    // Initialize models 
    let model;
    try {
      if (typeof modelModule === 'function') {
        // If it's a function that returns a model (old style)
        console.log(`Initializing model from function: ${file}`);
        model = modelModule(sequelize, Sequelize.DataTypes);
      } else if (modelModule.init && typeof modelModule.init === 'function') {
        // If it has an init method (Sequelize v5+)
        console.log(`Initializing model with init method: ${file}`);
        model = modelModule.init(sequelize, Sequelize.DataTypes);
      } else if (typeof modelModule === 'object' && modelModule.default) {
        // Handle ES module exports
        console.log(`Initializing model from default export: ${file}`);
        model = modelModule.default(sequelize, Sequelize.DataTypes);
      } else if (typeof modelModule === 'object') {
        // Directly exported model object
        console.log(`Using model object directly: ${file}`);
        model = modelModule;
      } else {
        console.warn(`Unable to initialize model from file: ${file}`);
        return;
      }
      
      console.log(`Successfully initialized model from: ${file}`);
    } catch (error) {
      console.error(`Error initializing model from ${file}:`, error);
      return;
    }
    
    // Add the model to the db object using the model's name as key
    db[model.name] = model;
  });

// Set up associations after all models are loaded
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import and set up associations
const setupAssociations = require('./associations');
setupAssociations(sequelize);

module.exports = db;
