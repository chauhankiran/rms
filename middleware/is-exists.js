const createHttpError = require("http-errors");
const exists = require("../services/_base/exists");

const isExists = (table) => async (req, res, next) => {
    const id = req.params.id;

    try {
        const is = await exists(table, id);

        if (!is) {
            return next(createHttpError(404));
        }

        next();
    } catch (error) {
        console.log("error", error);
        return next(createHttpError(404));
    }
};

module.exports = isExists;
