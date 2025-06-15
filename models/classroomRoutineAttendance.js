// models/classroomRoutineAttendance.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClassroomRoutineAttendance = sequelize.define('ClassroomRoutineAttendance', {
    routineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classroom_routines',
        key: 'id'
      }
    },
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cadets',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
      defaultValue: 'present'
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    markedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'classroom_routine_attendance',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['routineId', 'cadetId'],
        name: 'unique_routine_cadet'
      }
    ]
  });

  ClassroomRoutineAttendance.associate = function(models) {
    ClassroomRoutineAttendance.belongsTo(models.ClassroomRoutine, {
      foreignKey: 'routineId',
      as: 'routine'
    });
    ClassroomRoutineAttendance.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet'
    });
    ClassroomRoutineAttendance.belongsTo(models.User, {
      foreignKey: 'markedById',
      as: 'markedBy'
    });
  };

  return ClassroomRoutineAttendance;
};