const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/adminAuth');

// Load environment variables
require('dotenv').config();

// Admin registration validation rules
const validateRegistration = [
  check('name', 'Name is required').notEmpty(),
  check('mobileNumber', 'Please include a valid 10-digit mobile number').isMobilePhone('en-IN'),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Invalid role. Must be one of: superadmin, admin, moderator, hostel incharge, battalion incharge, attendance incharge, receptionist')
    .isIn([
      'superadmin',
      'admin',
      'moderator',
      'hostel incharge',
      'battalion incharge',
      'attendance incharge',
      'receptionist',
      'hr incharge'
    ])
];

// Role-based access control middleware
const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (roles.length && !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  };
};

// Admin login validation rules
const validateLogin = [
  check('mobileNumber', 'Please include a valid mobile number').isMobilePhone('en-IN'),
  check('password', 'Password is required').exists()
];

// @route   POST /api/admin/register
// @desc    Register a new admin
// @access  Public
router.post('/register', validateRegistration, adminController.registerAdmin);

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', validateLogin, adminController.loginAdmin);

// @route   GET /api/admin/me
// @desc    Get logged-in admin details
// @access  Private (requires authentication)
router.get('/me', authenticateAdmin, adminController.getAdminDetails);

// @route   GET /api/admin/all
// @desc    Get all admins (superadmin and admin only)
// @access  Private (superadmin and admin only)
router.get('/all', adminController.getAllAdmins);

// @route   PUT /api/admin/:id
// @desc    Update admin details (superadmin and admin only)
// @access  Private (superadmin and admin only)
router.put('/:id', 
  authenticateAdmin, 
  checkRole(['superadmin', 'admin']),
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('mobileNumber', 'Please include a valid 10-digit mobile number').optional().isMobilePhone('en-IN'),
    check('role', 'Invalid role').optional().isIn([
      'superadmin', 'admin', 'moderator', 'hostel incharge', 'hr incharge',
      'battalion incharge', 'attendance incharge', 'receptionist'
    ])
  ],
  adminController.updateAdmin
);

// @route   DELETE /api/admin/:id
// @desc    Delete an admin (superadmin and admin only)
// @access  Private (superadmin and admin only)
router.delete('/:id', authenticateAdmin, checkRole(['superadmin', 'admin']), adminController.deleteAdmin);

// @route   POST /api/admin/change-password
// @desc    Change own password
// @access  Private (any authenticated admin)
router.post('/change-password',
  authenticateAdmin,
  [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  adminController.changePassword
);

// @route   POST /api/admin/reset-password/:id
// @desc    Reset another admin's password (superadmin only)
// @access  Private (superadmin only)
router.post('/reset-password/:id',
  authenticateAdmin,
  checkRole(['superadmin']),
  [
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const admin = await db.Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }
);

module.exports = router;
