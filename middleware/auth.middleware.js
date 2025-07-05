const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: ['role']
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Middleware to check if user has a specific role
 * @param {...String} roles - List of role names
 */
const hasRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const hasRequiredRole = await req.user.hasAnyRole(roles);
      
      if (!hasRequiredRole) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking user role' 
      });
    }
  };
};

/**
 * Middleware to check if user has a specific permission
 * @param {String} permission - Permission name
 */
const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const hasPerm = await req.user.hasPermission(permission);
      
      if (!hasPerm) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking user permissions' 
      });
    }
  };
};

/**
 * Middleware to check if user can perform an action on a resource
 * @param {String} action - Action (create, read, update, delete, manage)
 * @param {String} resource - Resource name
 */
const can = (action, resource) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const hasAccess = await req.user.can(action, resource);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      console.error('Access check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking access permissions' 
      });
    }
  };
};

module.exports = {
  isAuthenticated,
  hasRole,
  hasPermission,
  can
};
