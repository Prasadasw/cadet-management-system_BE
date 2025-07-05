const { Role, Permission } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all roles with their permissions
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] } // Exclude junction table attributes
      }],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error getting roles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve roles',
      error: error.message
    });
  }
};

/**
 * Get role by ID with its permissions
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] } // Exclude junction table attributes
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Error getting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve role',
      error: error.message
    });
  }
};

/**
 * Create a new role with permissions
 */
exports.createRole = async (req, res) => {
  const transaction = await Role.sequelize.transaction();
  
  try {
    const { name, description, permissionIds } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create the role
    const role = await Role.create({
      name,
      description,
      isDefault: false
    }, { transaction });

    // Add permissions if any
    if (permissionIds && permissionIds.length > 0) {
      // Verify that all permission IDs exist
      const permissions = await Permission.findAll({
        where: { id: { [Op.in]: permissionIds } },
        transaction
      });

      if (permissions.length !== permissionIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'One or more permission IDs are invalid'
        });
      }

      await role.setPermissions(permissions, { transaction });
    }

    await transaction.commit();

    // Fetch the created role with permissions
    const createdRole = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: createdRole
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    });
  }
};

/**
 * Update a role and its permissions
 */
exports.updateRole = async (req, res) => {
  const transaction = await Role.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;

    // Find the role
    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent updating default roles' names
    if (role.isDefault && name && name !== role.name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot rename default roles'
      });
    }

    // Update role fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    await role.save({ transaction });

    // Update permissions if provided
    if (permissionIds) {
      // Verify that all permission IDs exist
      const permissions = await Permission.findAll({
        where: { id: { [Op.in]: permissionIds } },
        transaction
      });

      if (permissions.length !== permissionIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'One or more permission IDs are invalid'
        });
      }

      await role.setPermissions(permissions, { transaction });
    }

    await transaction.commit();

    // Fetch the updated role with permissions
    const updatedRole = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    });
  }
};

/**
 * Delete a role
 */
exports.deleteRole = async (req, res) => {
  const transaction = await Role.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Find the role
    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent deleting default roles
    if (role.isDefault) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default roles'
      });
    }

    // Check if any users are assigned to this role
    const userCount = await role.countUsers({ transaction });
    if (userCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role with assigned users. Please reassign users first.'
      });
    }

    // Delete the role
    await role.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message
    });
  }
};

/**
 * Get all permissions
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['resource', 'ASC'], ['action', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error getting permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve permissions',
      error: error.message
    });
  }
};
