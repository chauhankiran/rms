const createError = require("http-errors");

const isAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    next(createError(401));
  }
};

module.exports = isAuth;