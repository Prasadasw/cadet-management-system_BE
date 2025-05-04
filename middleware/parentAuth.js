const jwt = require('jsonwebtoken');
const { Parent } = require('../models');

const parentAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    // Check if no token
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    // Log full authorization header for debugging
    console.log('Full Authorization Header:', authHeader);

    // Extract token (remove 'Bearer ' prefix)
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ 
        message: 'Invalid token format' 
      });
    }

    const token = tokenParts[1];

    // Log token for debugging
    console.log('Received Token:', token);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your_jwt_secret_for_parent_auth'
      );
    } catch (verifyError) {
      console.error('Token Verification Error:', verifyError);
      return res.status(401).json({ 
        message: 'Invalid token',
        error: verifyError.message 
      });
    }

    // Log decoded token for debugging
    console.log('Decoded Token:', decoded);

    // Find parent by email from decoded token
    const parent = await Parent.findOne({
      where: { email: decoded.email },
      include: [{
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'fullName', 'chestNumber', 'battalionId', 'emailId']
      }],
      attributes: ['id', 'email', 'cadetId']
    });

    if (!parent) {
      return res.status(401).json({ 
        message: 'Parent not found' 
      });
    }

    // Attach parent and cadet to request for use in subsequent middleware/controllers
    req.parent = parent;
    req.cadet = parent.cadet;

    next();
  } catch (error) {
    console.error('Parent Authentication Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired' 
      });
    }

    res.status(500).json({
      message: 'Internal server error during authentication',
      error: error.message
    });
  }
};

module.exports = parentAuth;
