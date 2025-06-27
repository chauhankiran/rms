const notFound = require("../../errors/not-found");
const stagesService = require("../../services/admin/stages-service");
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
            const stages = await stagesService.find(optionsObj);
            const { count } = await stagesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/admin/stages",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("admin/stages/index", {
                title: "Stages",
                stages,
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
        res.render("admin/stages/new", {
            title: "New stage",
        });
    },

    create: async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect("/admin/stages/new");
        }

        try {
            const stageObj = {
                name,
                createdBy: req.session.currentUser.id,
            };
            await stagesService.create(stageObj);

            req.flash("info", "Stage is created.");
            return res.redirect("/admin/stages");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            return res.render("admin/stages/show", {
                title: "Show stage",
                stage,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            return res.render("admin/stages/edit", {
                title: "Edit stage",
                stage,
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
            return res.redirect(`/admin/stages/${id}/edit`);
        }

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            const stageObj = {
                id,
                name,
                updatedBy: req.session.currentUser.id,
            };
            await stagesService.update(stageObj);

            req.flash("info", "Stage is updated.");
            return res.redirect(`/admin/stages/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            await stagesService.destroy(id);

            req.flash("info", "Stage is deleted.");
            return res.redirect("/admin/stages");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            const stageObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await stagesService.archive(stageObj);

            req.flash("info", "Stage is archived.");
            return res.redirect(`/admin/stages/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const stage = await stagesService.findOne(id);

            if (!stage) {
                return next(notFound());
            }

            const stageObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            await stagesService.active(stageObj);

            req.flash("info", "Stage is activated.");
            return res.redirect(`/admin/stages/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
