'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Classroom.init({
    className: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Classroom',
    tableName: 'classrooms',
    timestamps: true,
    paranoid: true // Enable soft delete
  });
  return Classroom;
};
