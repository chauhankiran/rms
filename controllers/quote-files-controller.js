const quoteFilesService = require("../services/quote-files-service");

module.exports = {
    create: async (req, res, next) => {
        const quoteId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/quotes/${quoteId}`);
        }

        try {
            const quoteFileObj = {
                name,
                displayName,
                quoteId: quoteId || null,
                createdBy: req.session.currentUser.id,
            };
            await quoteFilesService.create(quoteFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/quotes/${quoteId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, quoteId } = req.params;

        try {
            const file = await quoteFilesService.findOneById(id);

            console.log("file", file);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/quotes/${quoteId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/quotes/${quoteId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { quoteId, id } = req.params;

        try {
            await quoteFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/quotes/${quoteId}`);
        } catch (err) {
            next(err);
        }
    },
};
