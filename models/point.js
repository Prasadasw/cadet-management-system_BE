'use strict';
module.exports = (sequelize, DataTypes) => {
  const Point = sequelize.define('Point', {
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pointType: {
      type: DataTypes.ENUM('positive', 'negative'),
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  Point.associate = function(models) {
    Point.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      onDelete: 'CASCADE'
    });
  };

  return Point;
};
