const createError = require("http-errors");

const notFound = () => {
  createError(404);
};

module.exports = notFound;
