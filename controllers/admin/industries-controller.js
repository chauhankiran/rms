const notFound = require("../../errors/not-found");
const industriesService = require("../../services/admin/industries-service");
const generatePaginationLinks = require("../../helpers/generate-pagination-links");

module.exports = {
    index: async (req, res, next) => {
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const orderBy = req.query.orderBy || "id";
        const orderDir = req.query.orderDir || "ASC";

        try {
            const optionsObj = { search, limit, skip, orderBy, orderDir };
            const industries = await industriesService.find(optionsObj);
            const { count } = await industriesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/industries",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/industries/index", {
                title: "Industries",
                industries,
                paginationLinks,
                search,
                count,
                orderBy,
                orderDir,
            });
        } catch (err) {
            next(err);
        }
    },

    new: async (req, res, next) => {
        res.render("admin/industries/new", {
            title: "New Industry",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/industries/new");
        }

        try {
            const industryObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await industriesService.create(industryObj);

            req.flash("info", "Industry is created.");
            return res.redirect("/admin/industries");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            return res.render("admin/industries/show", {
                title: "Show industry",
                industry,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            return res.render("admin/industries/edit", {
                title: "Edit industry",
                industry,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/admin/industries/${id}/edit`);
        }

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            const industryObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await industriesService.update(industryObj);

            req.flash("info", "Industry is updated.");
            return res.redirect(`/admin/industries/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            await industriesService.destroy(id);

            req.flash("info", "Industry is deleted.");
            return res.redirect("/admin/industries");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            const industryObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await industriesService.archive(industryObj);

            req.flash("info", "Industry is archived.");
            return res.redirect(`/admin/industries/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const industry = await industriesService.findOne(id);

            if (!industry) {
                return next(notFound());
            }

            const industryObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await industriesService.active(industryObj);

            req.flash("info", "Industry is activated.");
            return res.redirect(`/admin/industries/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
