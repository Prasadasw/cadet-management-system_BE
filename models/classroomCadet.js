'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassroomCadet extends Model {
    static associate(models) {
      // Associations are defined in the index.js file
    }
  }
  ClassroomCadet.init({
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classrooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cadets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., 2024-2025'
    },
    status: {
      type: DataTypes.ENUM('active', 'transferred', 'graduated', 'withdrawn'),
      defaultValue: 'active'
    },
    joinedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    leftDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ClassroomCadet',
    tableName: 'classroom_cadets',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['classroomId', 'cadetId', 'academicYear']
      }
    ]
  });
  return ClassroomCadet;
};
