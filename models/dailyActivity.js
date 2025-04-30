'use strict';
module.exports = (sequelize, DataTypes) => {
  const DailyActivity = sequelize.define('DailyActivity', {
    activityName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activityType: {
      type: DataTypes.ENUM('daily', 'custom'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    battalionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Battalions',
        key: 'id'
      }
    }
  }, {});

  DailyActivity.associate = function(models) {
    DailyActivity.belongsTo(models.Battalion, {
      foreignKey: 'battalionId',
      as: 'battalion'
    });
    DailyActivity.hasMany(models.CadetActivityAttendance, {
      foreignKey: 'activityId',
      as: 'attendances'
    });
  };

  return DailyActivity;
}; 