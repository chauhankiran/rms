const companyCommentsService = require("../services/company-comments-service");

module.exports = {
    create: async (req, res, next) => {
        const companyId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            req.flash("error", "Comment is required.");
            return res.redirect(`/companies/${companyId}`);
        }

        try {
            const companyCommentObj = {
                comment,
                companyId: companyId || null,
                createdBy: req.session.currentUser.id,
            };
            await companyCommentsService.create(companyCommentObj);

            req.flash("info", "Comment is created.");

            return res.redirect(`/companies/${companyId}`);
        } catch (err) {
            next(err);
        }
    },
};
