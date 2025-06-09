'use strict';
module.exports = (sequelize, DataTypes) => {
  const HostelInventory = sequelize.define('HostelInventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hostelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hostels',
        key: 'id'
      }
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assignDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'HostelInventory',
    tableName: 'hostel_inventory',
    timestamps: true
  });

  HostelInventory.associate = function(models) {
    HostelInventory.belongsTo(models.Hostel, { 
      foreignKey: 'hostelId',
      as: 'hostel'
    });
  };

  return HostelInventory;
};