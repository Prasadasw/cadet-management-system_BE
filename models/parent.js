'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cadets',
        key: 'id'
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Parents',
    timestamps: true
  });

  Parent.associate = function(models) {
    Parent.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Parent.hasMany(models.OutpassRequest, {
      foreignKey: 'parentId',
      as: 'outpassRequests',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Parent;
};
