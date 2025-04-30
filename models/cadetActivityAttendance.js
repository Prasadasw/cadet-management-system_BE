'use strict';
module.exports = (sequelize, DataTypes) => {
  const CadetActivityAttendance = sequelize.define('CadetActivityAttendance', {
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cadets',
        key: 'id'
      }
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DailyActivities',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent'),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});

  CadetActivityAttendance.associate = function(models) {
    CadetActivityAttendance.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet'
    });
    CadetActivityAttendance.belongsTo(models.DailyActivity, {
      foreignKey: 'activityId',
      as: 'activity'
    });
  };

  return CadetActivityAttendance;
}; 