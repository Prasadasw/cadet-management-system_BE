const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is not valid' 
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }
}; 