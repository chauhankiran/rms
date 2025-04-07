const ticketCommentsService = require("../services/ticket-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const ticketId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/tickets/${ticketId}`);
        }

        try {
            const ticketCommentObj = {
                comment,
                ticketId: ticketId || null,
                createdBy: req.session.currentUser.id,
            };
            await ticketCommentsService.create(ticketCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/tickets/${ticketId}`);
        } catch (err) {
            next(err);
        }
    },
};
