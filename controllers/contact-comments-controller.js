const contactCommentsService = require("../services/contact-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const contactId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/contacts/${contactId}`);
        }

        try {
            const contactCommentObj = {
                comment,
                contactId: contactId || null,
                createdBy: req.session.currentUser.id,
            };
            await contactCommentsService.create(contactCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/contacts/${contactId}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const { contactId, id } = req.params;

        try {
            await contactCommentsService.destroy(id);

            req.flash("info", "Comment is deleted.");

            return res.redirect(`/contacts/${contactId}`);
        } catch (err) {
            next(err);
        }
    },
};
