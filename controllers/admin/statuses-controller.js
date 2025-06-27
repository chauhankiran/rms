const notFound = require("../../errors/not-found");
const statusesService = require("../../services/admin/statuses-service");
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
            const statuses = await statusesService.find(optionsObj);
            const { count } = await statusesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/statuses",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/statuses/index", {
                title: "Statuses",
                statuses,
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
        res.render("admin/statuses/new", {
            title: "New status",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/statuses/new");
        }

        try {
            const statusObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await statusesService.create(statusObj);

            req.flash("info", "Status is created.");
            return res.redirect("/admin/statuses");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            return res.render("admin/statuses/show", {
                title: "Show status",
                status,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            return res.render("admin/statuses/edit", {
                title: "Edit status",
                status,
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
            return res.redirect(`/admin/statuses/${id}/edit`);
        }

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            const statusObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await statusesService.update(statusObj);

            req.flash("info", "Status is updated.");
            return res.redirect(`/admin/statuses/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            await statusesService.destroy(id);

            req.flash("info", "Status is deleted.");
            return res.redirect("/admin/statuses");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            const statusObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await statusesService.archive(statusObj);

            req.flash("info", "Status is archived.");
            return res.redirect(`/admin/statuses/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const status = await statusesService.findOne(id);

            if (!status) {
                return next(notFound());
            }

            const statusObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await statusesService.active(statusObj);

            req.flash("info", "Status is activated.");
            return res.redirect(`/admin/statuses/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
