const createError = require("http-errors");
const labels = require("../constants/label");

const checkLabel = (req, res, next) => {
    const label = req.params.label;
    if (!labels[label]) {
        return next(createError(404));
    }
    res.locals.label = labels[label];
    req.label = labels[label];

    next();
};

module.exports = checkLabel;
