const notFound = require("../../errors/not-found");
const sourcesService = require("../../services/admin/sources-service");
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
            const sources = await sourcesService.find(optionsObj);
            const { count } = await sourcesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/sources",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/sources/index", {
                title: "Sources",
                sources,
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
        res.render("admin/sources/new", {
            title: "New Source",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/sources/new");
        }

        try {
            const sourceObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await sourcesService.create(sourceObj);

            req.flash("info", "Source is created.");
            return res.redirect("/admin/sources");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            return res.render("admin/sources/show", {
                title: "Show source",
                source,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            return res.render("admin/sources/edit", {
                title: "Edit source",
                source,
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
            return res.redirect(`/admin/sources/${id}/edit`);
        }

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            const sourceObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await sourcesService.update(sourceObj);

            req.flash("info", "Source is updated.");
            return res.redirect(`/admin/sources/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            await sourcesService.destroy(id);

            req.flash("info", "Source is deleted.");
            return res.redirect("/admin/sources");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            const sourceObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await sourcesService.archive(sourceObj);

            req.flash("info", "Source is archived.");
            return res.redirect(`/admin/sources/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const source = await sourcesService.findOne(id);

            if (!source) {
                return next(notFound());
            }

            const sourceObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await sourcesService.active(sourceObj);

            req.flash("info", "Source is activated.");
            return res.redirect(`/admin/sources/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
