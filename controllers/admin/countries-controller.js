const notFound = require("../../errors/not-found");
const countriesService = require("../../services/admin/countries-service");
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
            const countries = await countriesService.find(optionsObj);
            const { count } = await countriesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/countries",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/countries/index", {
                title: "Countries",
                countries,
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
        res.render("admin/countries/new", {
            title: "New country",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/countries/new");
        }

        try {
            const countryObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await countriesService.create(countryObj);

            req.flash("info", "Country is created.");
            return res.redirect("/admin/countries");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            return res.render("admin/countries/show", {
                title: "Show country",
                country,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            return res.render("admin/countries/edit", {
                title: "Edit country",
                country,
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
            return res.redirect(`/admin/countries/${id}/edit`);
        }

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            const countryObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await countriesService.update(countryObj);

            req.flash("info", "Country is updated.");
            return res.redirect(`/admin/countries/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            await countriesService.destroy(id);

            req.flash("info", "Country is deleted.");
            return res.redirect("/admin/countries");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            const countryObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await countriesService.archive(countryObj);

            req.flash("info", "Country is archived.");
            return res.redirect(`/admin/countries/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const country = await countriesService.findOne(id);

            if (!country) {
                return next(notFound());
            }

            const countryObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await countriesService.active(countryObj);

            req.flash("info", "Country is activated.");
            return res.redirect(`/admin/countries/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
