'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // One-to-many relationship with User
      this.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
      });

      // Many-to-many relationship with Permission through RolePermission
      this.belongsToMany(models.Permission, {
        through: 'RolePermission',
        foreignKey: 'roleId',
        otherKey: 'permissionId',
        as: 'permissions'
      });
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true
  });

  return Role;
};