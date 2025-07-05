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

    const { name, mobileNumber, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { mobileNumber } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this mobile number already exists' });
    }

    // Create admin with the specified role
    const admin = await Admin.create({
      name,
      mobileNumber,
      password,
      role: role || 'admin' // Default to 'admin' if role is not provided
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

// Get all admins (only for superadmin)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] }, // Don't return passwords
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      message: 'Admins retrieved successfully',
      data: admins
    });
  } catch (error) {
    console.error('Error in getAllAdmins:', error);
    res.status(500).json({ message: 'Error retrieving admins', error: error.message });
  }
};

// Update admin (only for superadmin)
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobileNumber, role, password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields if provided
    if (name) admin.name = name;
    if (mobileNumber) admin.mobileNumber = mobileNumber;
    if (role) admin.role = role;
    if (password) admin.password = password; // Password will be hashed by the model hook

    await admin.save();

    // Remove password from response
    const adminData = admin.get();
    delete adminData.password;

    res.json({
      message: 'Admin updated successfully',
      data: adminData
    });
  } catch (error) {
    console.error('Error in updateAdmin:', error);
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

// Delete admin (only for superadmin)
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (req.admin.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const result = await Admin.destroy({ where: { id } });
    
    if (!result) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteAdmin:', error);
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

// Change password (for any admin to change their own password)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findByPk(req.admin.id);

    // Verify current password
    const isPasswordValid = await admin.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update to new password
    admin.password = newPassword;
    await admin.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminDetails,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword
};
