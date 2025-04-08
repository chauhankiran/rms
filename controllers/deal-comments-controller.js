const dealCommentsService = require("../services/deal-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const dealId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/deals/${dealId}`);
        }

        try {
            const dealCommentObj = {
                comment,
                dealId: dealId || null,
                createdBy: req.session.currentUser.id,
            };
            await dealCommentsService.create(dealCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/deals/${dealId}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { dealId, id } = req.params;

        try {
            await dealCommentsService.destroy(id);

            req.flash("info", "Comment is deleted.");

            return res.redirect(`/deals/${dealId}`);
        } catch (err) {
            next(err);
        }
    },
};
