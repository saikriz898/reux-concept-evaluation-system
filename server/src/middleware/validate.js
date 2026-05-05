const { ApiError } = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new ApiError(400, message);
  }
};

module.exports = { validate };
