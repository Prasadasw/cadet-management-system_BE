const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Middleware to authenticate admin using JWT
exports.authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Get admin from the token
    const admin = await Admin.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Check if the token is for an admin
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Attach admin to request object
    req.admin = admin;
    req.user = { id: admin.id, role: admin.role }; // For compatibility with existing auth
    
    next();
  } catch (error) {
    console.error('Error in admin authentication:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error during authentication' });
  }
};
