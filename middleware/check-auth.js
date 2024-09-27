const createError = require("http-errors");

const checkAuth = (req, res, next) => {
  if (req.session && req.session.currentUser) {
    return next();
  } else {
    next(createError(401));
  }
};

module.exports = checkAuth;
