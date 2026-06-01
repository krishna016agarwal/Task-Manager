const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.body = result.data;
  next();
};

module.exports = validate;