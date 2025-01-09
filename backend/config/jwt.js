const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Ensure organization_id is part of the token payload
  return jwt.sign(
    { 
      id: user.id, 
      first_name: user.first_name, 
      email: user.email, 
      role: user.role, 
      organization_id: user.organization_id // Add organization_id here
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.name);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};