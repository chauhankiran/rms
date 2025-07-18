const notFound = require("../../errors/not-found");
const labelsService = require("../../services/admin/labels-service");
const generatePaginationLinks = require("../../helpers/generate-pagination-links");
const message = require("../../helpers/message");
const locales = require("../../locales/en");
const { PER_PAGE } = require("../../constants/app");

module.exports = {
    index: async (req, res, next) => {
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || PER_PAGE;
        const skip = (page - 1) * limit;
        const orderBy = req.query.orderBy || "id";
        const orderDir = req.query.orderDir || "DESC";

        try {
            const optionsObj = { search, limit, skip, orderBy, orderDir };
            const labels = await labelsService.find(req.label.table, optionsObj);
            const { count } = await labelsService.count(req.label.table, optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: `/admin/labels/${req.label.key}`,
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/labels/index", {
                title: req.label.pluralName,
                labels_: labels,
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

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const label = await labelsService.findOne(req.label.table, id);

            if (!label) {
                return next(notFound());
            }

            return res.render("admin/labels/show", {
                title: label.displayName,
                label_: label,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const label = await labelsService.findOne(req.label.table, id);

            if (!label) {
                return next(notFound());
            }

            return res.render("admin/labels/edit", {
                title: `Edit ${label.displayName} label`,
                label_: {...label, isActive: label.isActive ? 'Y' : 'N'},
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { displayName, isActive } = req.body;

        if (!displayName) {
            req.flash("error", message(locales.label.displayNameRequired));
            return res.redirect(`/admin/labels/${req.label.key}/${id}/edit`);
        }

        try {
            const label = await labelsService.findOne(req.label.table, id);

            if (!label) {
                return next(notFound());
            }

            const labelObj = {
                id,
                displayName,
                updatedBy: req.session.currentUser.id,
                isActive: isActive === 'Y' ? true : false
            };
            const resp = await labelsService.update(req.label.table, labelObj);

            req.flash("info", message(locales.label.updated, { name: resp.displayName }));
            return res.redirect(`/admin/labels/${req.label.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const label = await labelsService.findOne(req.label.table, id);

            if (!label) {
                return next(notFound());
            }

            const labelObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await labelsService.archive(req.label.table, labelObj);

            req.flash("info", message(locales.label.archived, { name: resp.displayName }));
            return res.redirect(`/admin/labels/${req.label.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const label = await labelsService.findOne(req.label.table, id);

            if (!label) {
                return next(notFound());
            }

            const labelObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await labelsService.active(req.label.table, labelObj);

            req.flash("info", message(locales.label.activated, { name: resp.displayName }));
            return res.redirect(`/admin/labels/${req.label.key}/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
