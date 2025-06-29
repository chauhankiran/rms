const createError = require("http-errors");
const exists = require("../services/_base/exists");

const checkExists = (table) => async (req, res, next) => {
    const id = req.params.id;

    try {
        const is = await exists(table, id);

        if (!is) {
            return next(createError(404));
        }

        next();
    } catch (error) {
        console.log("error", error);
        return next(createError(404));
    }
};

module.exports = checkExists;
