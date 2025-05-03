'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hostel = sequelize.define('Hostel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'hostels',
    timestamps: true
  });

  Hostel.associate = function(models) {
    Hostel.hasMany(models.Room, {
      foreignKey: 'hostelId',
      as: 'rooms'
    });
    Hostel.hasMany(models.HostelCadetAllocation, {
      foreignKey: 'hostelId',
      as: 'cadetAllocations'
    });
  };

  return Hostel;
};
