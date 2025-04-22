const createError = require("http-errors");

const checkModule = (module) => (req, res, next) => {
    if (req.session && req.session.modules && req.session.modules[module]) {
        return next();
    } else {
        next(createError(404));
    }
};

module.exports = checkModule;
