const createError = require("http-errors");
const refs = require("../constants/ref");

const checkRef = (req, res, next) => {
    const ref = req.params.ref;
    if (!refs[ref]) {
        return next(createError(404));
    }
    res.locals.ref = refs[ref];
    req.ref = refs[ref];

    next();
};

module.exports = checkRef;
