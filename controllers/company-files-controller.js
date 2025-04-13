const companyFilesService = require("../services/company-files-service");

module.exports = {
    create: async (req, res, next) => {
        const companyId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/companies/${companyId}`);
        }

        try {
            const companyFileObj = {
                name,
                displayName,
                companyId: companyId || null,
                createdBy: req.session.currentUser.id,
            };
            await companyFilesService.create(companyFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/companies/${companyId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, companyId } = req.params;

        try {
            const file = await companyFilesService.findOneById(id);

            console.log("file", file);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/companies/${companyId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/companies/${companyId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { companyId, id } = req.params;

        try {
            await companyFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/companies/${companyId}`);
        } catch (err) {
            next(err);
        }
    },
};
