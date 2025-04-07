const quoteCommentsService = require("../services/quote-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const quoteId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/quotes/${quoteId}`);
        }

        try {
            const quoteCommentObj = {
                comment,
                quoteId: quoteId || null,
                createdBy: req.session.currentUser.id,
            };
            await quoteCommentsService.create(quoteCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/quotes/${quoteId}`);
        } catch (err) {
            next(err);
        }
    },
};
