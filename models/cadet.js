'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cadet = sequelize.define('Cadet', {
    fullName: DataTypes.STRING,
    chestNumber: DataTypes.STRING,
    battalionId: DataTypes.INTEGER,
    hostelId: DataTypes.INTEGER,
    roomNumber: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
    schoolDetails: DataTypes.STRING,
    parentsDetails: DataTypes.STRING,
    parentContactNumber: DataTypes.STRING,
    relationship: DataTypes.STRING,
    emailId: DataTypes.STRING,
    mobileSubmitted: DataTypes.BOOLEAN,
    initialPoints: DataTypes.INTEGER,
    batchYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2000,
        max: new Date().getFullYear() + 1
      }
    }
  }, {});
  
  Cadet.associate = function(models) {
    Cadet.belongsTo(models.Battalion, {
      foreignKey: 'battalionId',
      as: 'battalion'
    });
    Cadet.hasMany(models.CadetPoint, {
      foreignKey: 'cadetId',
      as: 'points'
    });
  };

  return Cadet;
};
