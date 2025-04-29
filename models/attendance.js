'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cadets',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent'),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet'
    });
  };

  return Attendance;
}; 