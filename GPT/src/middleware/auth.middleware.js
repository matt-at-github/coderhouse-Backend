// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization');

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request for future use
    req.user = { _id: decodedToken.userId };

    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateUser,
};
