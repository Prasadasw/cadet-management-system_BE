// models/classroomRoutine.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClassroomRoutine = sequelize.define('ClassroomRoutine', {
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classrooms',
        key: 'id'
      }
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    }
  }, {
    tableName: 'classroom_routines',
    timestamps: true,
    paranoid: true
  });

  ClassroomRoutine.associate = function(models) {
    ClassroomRoutine.belongsTo(models.Classroom, {
      foreignKey: 'classroomId',
      as: 'classroom'
    });
  };

  return ClassroomRoutine;
};