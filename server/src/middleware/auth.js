const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthenticated: No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    throw new ApiError(401, 'Invalid token');
  }
};

module.exports = { verifyToken };
