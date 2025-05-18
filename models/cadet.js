'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cadet = sequelize.define('Cadet', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chestNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    battalionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'battalions',
        key: 'id'
      }
    },
    hostelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'hostels',
        key: 'id'
      }
    },
    roomNumber: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
    schoolDetails: DataTypes.STRING,
    parentsDetails: DataTypes.STRING,
    parentContactNumber: DataTypes.STRING,
    relationship: DataTypes.STRING,
    emailId: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    mobileSubmitted: DataTypes.BOOLEAN,
    initialPoints: DataTypes.INTEGER,
    batchYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2000,
        max: new Date().getFullYear() + 1
      }
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: 'REG-UNASSIGNED'
    },
    collegeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternateMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
  }, {
    tableName: 'cadets',
    timestamps: true
  });
  
  Cadet.associate = function(models) {
    Cadet.belongsTo(models.Battalion, {
      foreignKey: 'battalionId',
      as: 'battalion',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Cadet.hasMany(models.CadetPoint, {
      foreignKey: 'cadetId',
      as: 'points',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cadet.hasOne(models.Parent, {
      foreignKey: 'cadetId',
      as: 'parent',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Cadet;
};
