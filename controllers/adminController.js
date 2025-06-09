const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../models');
const Admin = db.Admin;

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mobileNumber, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { mobileNumber } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this mobile number already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      mobileNumber,
      password,
      role: 'admin'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      data: {
        id: admin.id,
        name: admin.name,
        mobileNumber: admin.mobileNumber,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find admin by mobile number
    const admin = await Admin.findOne({ where: { mobileNumber } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Validate password
    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      data: {
        id: admin.id,
        name: admin.name,
        mobileNumber: admin.mobileNumber,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get admin details
const getAdminDetails = async (req, res) => {
  try {
    // The admin is already attached to the request object by the authenticateAdmin middleware
    // and the password is already excluded there
    const admin = req.admin;

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Admin details retrieved successfully',
      data: admin
    });
  } catch (error) {
    console.error('Error in getAdminDetails:', error);
    res.status(500).json({ message: 'Error retrieving admin details', error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminDetails
};
