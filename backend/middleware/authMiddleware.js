const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Received request body:", req.body);
  console.log("authmiddleware:",req.body)
 
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'organization_id']
    });
    console.log("authMIddlesware for user:",user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Attach user AND organization_id to the request
    req.user = {
      ...user.toJSON(),
      organization_id: user.organization_id
    };
    

    // If the route is for creating a ticket, allow it for any authenticated user
    if (req.path.includes('/tickets') && req.method === 'POST') {
      return next();
    }
    if (req.path.includes('/users') && req.method === 'POST') {
      return next();
    }
    if (req.path.includes('/auth') && req.method === 'POST') {
      return next();
    }
    if (req.path.includes('/organization') && req.method === 'POST') {
      return next();
    }

    // You might want to keep role-based access for other routes
    // This part depends on your specific authorization requirements
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;