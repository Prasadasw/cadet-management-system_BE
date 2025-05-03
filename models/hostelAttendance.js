'use strict';
module.exports = (sequelize, DataTypes) => {
  const HostelAttendance = sequelize.define('HostelAttendance', {
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
      type: DataTypes.ENUM('Present', 'Absent', 'Medical Leave'),
      allowNull: false,
      defaultValue: 'Absent'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['cadetId', 'date']
      }
    ]
  });
  
  HostelAttendance.associate = function(models) {
    HostelAttendance.belongsTo(models.Cadet, { 
      foreignKey: 'cadetId',
      as: 'cadet'
    });
  };

  return HostelAttendance;
};
