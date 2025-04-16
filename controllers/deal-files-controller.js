const dealFilesService = require("../services/deal-files-service");

module.exports = {
    create: async (req, res, next) => {
        const dealId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/deals/${dealId}`);
        }

        try {
            const dealFileObj = {
                name,
                displayName,
                dealId: dealId || null,
                createdBy: req.session.currentUser.id,
            };
            await dealFilesService.create(dealFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/deals/${dealId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, dealId } = req.params;

        try {
            const file = await dealFilesService.findOneById(id);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/deals/${dealId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/deals/${dealId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { dealId, id } = req.params;

        try {
            await dealFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/deals/${dealId}`);
        } catch (err) {
            next(err);
        }
    },
};
