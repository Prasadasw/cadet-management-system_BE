'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // Many-to-many association with Role through RolePermission
      this.belongsToMany(models.Role, {
        through: 'RolePermission',
        foreignKey: 'permissionId',
        as: 'roles'
      });
    }
  }
  
  Permission.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'manage'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps: true
  });

  return Permission;
};
