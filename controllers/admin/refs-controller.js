const notFound = require("../../errors/not-found");
const refsService = require("../../services/admin/refs-service");
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
            const refs = await refsService.find(req.ref.table, optionsObj);
            const { count } = await refsService.count(
                req.ref.table,
                optionsObj
            );

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: `/admin/refs/${req.ref.key}`,
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render(`admin/refs/index`, {
                title: `${req.ref.pluralName}`,
                refs,
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
        return res.render(`admin/refs/new`, {
            title: `New ${req.ref.singularName}`,
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/admin/refs/new`);
        }

        try {
            const refObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await refsService.create(req.ref.table, refObj);

            req.flash("info", `${req.ref.singularName} is created.`);
            return res.redirect(`/admin/refs/${req.ref.key}`);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            return res.render(`admin/refs/show`, {
                title: `Show ${req.ref.singularName}`,
                ref_: ref,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            return res.render(`admin/refs/edit`, {
                title: `Edit ${req.ref.singularName}`,
                ref_: ref,
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
            return res.redirect(`/admin/refs/${id}/edit`);
        }

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            const refObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await refsService.update(req.ref.table, refObj);

            req.flash("info", `${req.ref.singularName} is updated.`);
            return res.redirect(`/admin/refs/${req.ref.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            await refsService.destroy(req.ref.table, id);

            req.flash("info", `${req.ref.singularName} is deleted.`);
            return res.redirect(`/admin/refs/${req.ref.key}`);
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            const refObj = { id, updatedBy: req.session.currentUser.id };
            await refsService.archive(req.ref.table, refObj);

            req.flash("info", `${req.ref.singularName} is archived.`);
            return res.redirect(`/admin/refs/${req.ref.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ref = await refsService.findOne(req.ref.table, id);

            if (!ref) {
                return next(notFound());
            }

            const refObj = { id, updatedBy: req.session.currentUser.id };
            await refsService.active(req.ref.table, refObj);

            req.flash("info", `${req.ref.singularName} is activated.`);
            return res.redirect(`/admin/refs/${req.ref.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
