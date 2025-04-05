const taskCommentsService = require("../services/task-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const taskId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/tasks/${taskId}`);
        }

        try {
            const taskCommentObj = {
                comment,
                taskId: taskId || null,
                createdBy: req.session.currentUser.id,
            };
            await taskCommentsService.create(taskCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/tasks/${taskId}`);
        } catch (err) {
            next(err);
        }
    },
};
