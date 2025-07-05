'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    const roles = await queryInterface.bulkInsert('roles', [
      {
        name: 'Super Admin',
        description: 'Has full access to all features and settings',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        description: 'Has access to most features with some restrictions',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Battalion Incharge',
        description: 'Manages battalion-related operations',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hostel Incharge',
        description: 'Manages hostel-related operations',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HR',
        description: 'Manages human resources and staff',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Attendance Incharge',
        description: 'Manages attendance records',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Get role IDs
    const rolesMap = {};
    for (const role of roles) {
      rolesMap[role.name] = role.id;
    }

    // Define permissions
    const permissions = [
      // User management
      { name: 'user_create', description: 'Create users', resource: 'users', action: 'create' },
      { name: 'user_read', description: 'View users', resource: 'users', action: 'read' },
      { name: 'user_update', description: 'Update users', resource: 'users', action: 'update' },
      { name: 'user_delete', description: 'Delete users', resource: 'users', action: 'delete' },
      
      // Role management
      { name: 'role_manage', description: 'Manage roles and permissions', resource: 'roles', action: 'manage' },
      
      // Cadet management
      { name: 'cadet_manage', description: 'Manage cadets', resource: 'cadets', action: 'manage' },
      
      // Attendance
      { name: 'attendance_manage', description: 'Manage attendance', resource: 'attendance', action: 'manage' },
      { name: 'attendance_view', description: 'View attendance', resource: 'attendance', action: 'read' },
      
      // Hostel
      { name: 'hostel_manage', description: 'Manage hostel', resource: 'hostel', action: 'manage' },
      { name: 'hostel_view', description: 'View hostel details', resource: 'hostel', action: 'read' },
      
      // Reports
      { name: 'reports_view', description: 'View reports', resource: 'reports', action: 'read' },
      
      // Settings
      { name: 'settings_manage', description: 'Manage system settings', resource: 'settings', action: 'manage' }
    ];

    // Insert permissions
    const permissionRecords = await queryInterface.bulkInsert('permissions', 
      permissions.map(p => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      { returning: true }
    );

    // Create role-permission mappings
    const rolePermissions = [];
    
    // Super Admin gets all permissions
    for (const perm of permissionRecords) {
      rolePermissions.push({
        roleId: rolesMap['Super Admin'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Admin permissions (all except role management)
    const adminPermissions = permissionRecords.filter(p => p.name !== 'role_manage');
    for (const perm of adminPermissions) {
      rolePermissions.push({
        roleId: rolesMap['Admin'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Battalion Incharge permissions
    const battalionPermissions = permissionRecords.filter(p => 
      p.resource === 'attendance' || 
      p.resource === 'cadets' ||
      p.name === 'reports_view'
    );
    for (const perm of battalionPermissions) {
      rolePermissions.push({
        roleId: rolesMap['Battalion Incharge'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Hostel Incharge permissions
    const hostelPermissions = permissionRecords.filter(p => 
      p.resource === 'hostel' ||
      p.name === 'reports_view'
    );
    for (const perm of hostelPermissions) {
      rolePermissions.push({
        roleId: rolesMap['Hostel Incharge'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // HR permissions
    const hrPermissions = permissionRecords.filter(p => 
      p.resource === 'users' ||
      p.name === 'reports_view' ||
      p.name === 'cadet_manage'
    );
    for (const perm of hrPermissions) {
      rolePermissions.push({
        roleId: rolesMap['HR'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Attendance Incharge permissions
    const attendanceInchargePermissions = permissionRecords.filter(p => 
      p.resource === 'attendance' ||
      p.name === 'reports_view'
    );
    for (const perm of attendanceInchargePermissions) {
      rolePermissions.push({
        roleId: rolesMap['Attendance Incharge'],
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insert role-permission mappings
    await queryInterface.bulkInsert('role_permissions', rolePermissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
