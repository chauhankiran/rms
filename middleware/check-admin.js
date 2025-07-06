const createError = require("http-errors");

const checkAdmin = (req, res, next) => {
    if (req.session.currentUser.type === "admin") {
        return next();
    } else {
        next(createError(401));
    }
};

module.exports = checkAdmin;
