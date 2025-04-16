const ticketFilesService = require("../services/ticket-files-service");

module.exports = {
    create: async (req, res, next) => {
        const ticketId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/tickets/${ticketId}`);
        }

        try {
            const ticketFileObj = {
                name,
                displayName,
                ticketId: ticketId || null,
                createdBy: req.session.currentUser.id,
            };
            await ticketFilesService.create(ticketFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/tickets/${ticketId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, ticketId } = req.params;

        try {
            const file = await ticketFilesService.findOneById(id);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/tickets/${ticketId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/tickets/${ticketId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { ticketId, id } = req.params;

        try {
            await ticketFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/tickets/${ticketId}`);
        } catch (err) {
            next(err);
        }
    },
};
