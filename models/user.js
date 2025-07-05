'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  });

  // Association with Role
  User.associate = function(models) {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role'
    });
  };

  // Instance method to validate password
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // Check if user has a specific role
  User.prototype.hasRole = async function(roleName) {
    const role = await this.getRole();
    return role && role.name === roleName;
  };

  // Check if user has any of the specified roles
  User.prototype.hasAnyRole = async function(roleNames) {
    const role = await this.getRole();
    return role && roleNames.includes(role.name);
  };

  // Check if user has a specific permission
  User.prototype.hasPermission = async function(permissionName) {
    const user = await User.findOne({
      where: { id: this.id },
      include: [{
        model: sequelize.models.Role,
        as: 'role',
        include: [{
          model: sequelize.models.Permission,
          as: 'permissions',
          where: { name: permissionName },
          required: false
        }]
      }]
    });

    return user.role.permissions && user.role.permissions.length > 0;
  };

  // Check if user can perform an action on a resource
  User.prototype.can = async function(action, resource) {
    const user = await User.findOne({
      where: { id: this.id },
      include: [{
        model: sequelize.models.Role,
        as: 'role',
        include: [{
          model: sequelize.models.Permission,
          as: 'permissions',
          where: {
            resource: resource,
            action: action
          },
          required: false
        }]
      }]
    });

    return user.role.permissions && user.role.permissions.length > 0;
  };

  return User;
};
