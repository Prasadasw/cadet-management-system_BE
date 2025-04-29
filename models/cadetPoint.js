'use strict';
module.exports = (sequelize, DataTypes) => {
  const CadetPoint = sequelize.define('CadetPoint', {
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  CadetPoint.associate = function(models) {
    CadetPoint.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet'
    });
  };

  return CadetPoint;
}; 