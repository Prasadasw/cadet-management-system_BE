'use strict';
module.exports = (sequelize, DataTypes) => {
  const Battalion = sequelize.define('Battalion', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});

  Battalion.associate = function(models) {
    Battalion.hasMany(models.Cadet, {
      foreignKey: 'battalionId',
      as: 'cadets'
    });
  };

  return Battalion;
}; 