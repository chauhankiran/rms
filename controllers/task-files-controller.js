const taskFilesService = require("../services/task-files-service");

module.exports = {
    create: async (req, res, next) => {
        const taskId = req.params.id;

        const fileObj = req.file;
        const name = fileObj.filename;
        const displayName = fileObj.originalname;

        if (!displayName) {
            req.flash("error", "File is required.");
            return res.redirect(`/tasks/${taskId}`);
        }

        try {
            const taskFileObj = {
                name,
                displayName,
                taskId: taskId || null,
                createdBy: req.session.currentUser.id,
            };
            await taskFilesService.create(taskFileObj);

            req.flash("info", "File is created.");

            return res.redirect(`/tasks/${taskId}`);
        } catch (err) {
            next(err);
        }
    },

    download: async (req, res, next) => {
        const { id, taskId } = req.params;

        try {
            const file = await taskFilesService.findOneById(id);

            if (!file) {
                req.flash("error", "File not found.");
                return res.redirect(`/tasks/${taskId}`);
            }

            const filePath = `uploads/${file.name}`;

            res.download(filePath, file.displayName, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error downloading file.");
                    return res.redirect(`/tasks/${taskId}`);
                }
            });
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { taskId, id } = req.params;

        try {
            await taskFilesService.destroy(id);

            req.flash("info", "File is deleted.");

            return res.redirect(`/tasks/${taskId}`);
        } catch (err) {
            next(err);
        }
    },
};
