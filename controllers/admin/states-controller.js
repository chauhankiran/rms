const notFound = require("../../errors/not-found");
const statesService = require("../../services/admin/states-service");
const generatePaginationLinks = require("../../helpers/generate-pagination-links");

module.exports = {
    index: async (req, res, next) => {
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const orderBy = req.query.orderBy || "id";
        const orderDir = req.query.orderDir || "DESC";

        try {
            const optionsObj = { search, limit, skip, orderBy, orderDir };
            const states = await statesService.find(optionsObj);
            const { count } = await statesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/states",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/states/index", {
                title: "States",
                states,
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
        res.render("admin/states/new", {
            title: "New state",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/states/new");
        }

        try {
            const stateObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await statesService.create(stateObj);

            req.flash("info", "Contact industry is created.");
            return res.redirect("/admin/contact-industries");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            return res.render("admin/states/show", {
                title: "Show state",
                state,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            return res.render("admin/states/edit", {
                title: "Edit state",
                state,
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
            return res.redirect(`/admin/states/${id}/edit`);
        }

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            const stateObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await statesService.update(stateObj);

            req.flash("info", "State is updated.");
            return res.redirect(`/admin/states/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            await statesService.destroy(id);

            req.flash("info", "State is deleted.");
            return res.redirect("/admin/states");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            const stateObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await statesService.archive(stateObj);

            req.flash("info", "State is archived.");
            return res.redirect(`/admin/states/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const state = await statesService.findOne(id);

            if (!state) {
                return next(notFound());
            }

            const stateObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await statesService.active(stateObj);

            req.flash("info", "State is activated.");
            return res.redirect(`/admin/states/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
