const notFound = require("../../errors/not-found");
const typesService = require("../../services/admin/types-service");
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
            const types = await typesService.find(optionsObj);
            const { count } = await typesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/types",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/types/index", {
                title: "Types",
                types,
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
        res.render("admin/types/new", {
            title: "New type",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/types/new");
        }

        try {
            const typeObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await typesService.create(typeObj);

            req.flash("info", "Type is created.");
            return res.redirect("/admin/types");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            return res.render("admin/types/show", {
                title: "Show type",
                type,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            return res.render("admin/types/edit", {
                title: "Edit type",
                type,
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
            return res.redirect(`/admin/types/${id}/edit`);
        }

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            const typeObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await typesService.update(typeObj);

            req.flash("info", "Type is updated.");
            return res.redirect(`/admin/types/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            await typesService.destroy(id);

            req.flash("info", "Type is deleted.");
            return res.redirect("/admin/types");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            const typeObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await typesService.archive(typeObj);

            req.flash("info", "Type is archived.");
            return res.redirect(`/admin/types/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const type = await typesService.findOne(id);

            if (!type) {
                return next(notFound());
            }

            const typeObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await typesService.active(typeObj);

            req.flash("info", "Type is activated.");
            return res.redirect(`/admin/types/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
