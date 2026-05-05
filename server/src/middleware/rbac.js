const { ApiError } = require('../utils/apiError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};

module.exports = { authorize };
