'use strict';
module.exports = (sequelize, DataTypes) => {
  const Battalion = sequelize.define('battalion', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});

  Battalion.associate = function(models) {
    Battalion.hasMany(models.cadet, {
      foreignKey: 'battalionId',
      as: 'cadets'
    });
  };

  return Battalion;
}; 