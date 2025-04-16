const contactFilesService = require("../services/contact-files-service");

module.exports = {
    create: async (req, res, next) => {
        const contactId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/contacts/${contactId}`);
        }

        try {
            const contactFileObj = {
                name,
                displayName,
                contactId: contactId || null,
                createdBy: req.session.currentUser.id,
            };
            await contactFilesService.create(contactFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/contacts/${contactId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, contactId } = req.params;

        try {
            const file = await contactFilesService.findOneById(id);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/contacts/${contactId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/contacts/${contactId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { contactId, id } = req.params;

        try {
            await contactFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/contacts/${contactId}`);
        } catch (err) {
            next(err);
        }
    },
};
