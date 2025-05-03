'use strict';
module.exports = (sequelize, DataTypes) => {
  const HostelCadetAllocation = sequelize.define('HostelCadetAllocation', {
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cadets',
        key: 'id'
      }
    },
    hostelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hostels',
        key: 'id'
      }
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rooms',
        key: 'id'
      }
    },
    allocationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'hostel_cadet_allocations'
  });

  HostelCadetAllocation.associate = function(models) {
    HostelCadetAllocation.belongsTo(models.Cadet, { 
      foreignKey: 'cadetId',
      as: 'cadet'
    });
    HostelCadetAllocation.belongsTo(models.Hostel, { 
      foreignKey: 'hostelId',
      as: 'hostel'
    });
    HostelCadetAllocation.belongsTo(models.Room, { 
      foreignKey: 'roomId',
      as: 'room'
    });
  };

  return HostelCadetAllocation;
};
