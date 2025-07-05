const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { isAuthenticated, hasRole, hasPermission } = require('../middleware/auth.middleware');

// Get all roles (Admin and above)
router.get('/', 
  isAuthenticated, 
  hasRole(['Admin', 'Super Admin']), 
  roleController.getAllRoles
);

// Get role by ID (Admin and above)
router.get('/:id', 
  isAuthenticated, 
  hasRole(['Admin', 'Super Admin']), 
  roleController.getRoleById
);

// Create a new role (Super Admin only)
router.post('/', 
  isAuthenticated, 
  hasRole(['Super Admin']), 
  roleController.createRole
);

// Update a role (Super Admin only)
router.put('/:id', 
  isAuthenticated, 
  hasRole(['Super Admin']), 
  roleController.updateRole
);

// Delete a role (Super Admin only)
router.delete('/:id', 
  isAuthenticated, 
  hasRole(['Super Admin']), 
  roleController.deleteRole
);

// Get all permissions (Admin and above)
router.get('/permissions/all', 
  isAuthenticated, 
  hasRole(['Admin', 'Super Admin']), 
  roleController.getAllPermissions
);

module.exports = router;
