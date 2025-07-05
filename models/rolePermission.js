'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // Association with Role
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role'
      });
      
      // Association with Permission
      this.belongsTo(models.Permission, {
        foreignKey: 'permissionId',
        as: 'permission'
      });
    }
  }
  
  RolePermission.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permissionId']
      }
    ]
  });

  return RolePermission;
};
