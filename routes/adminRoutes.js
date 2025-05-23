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
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

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

module.exports = router;
