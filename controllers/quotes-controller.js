const notFound = require("../errors/not-found");
const quotesService = require("../services/quotes-service");
const quoteCommentsService = require("../services/quote-comments-service");
const quoteFilesService = require("../services/quote-files-service");
const quoteViewsService = require("../services/quote-views-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");

const columnsObj = {
    id: "q.id",
    name: "q.name",
    total: "q.total",
    createdBy: 'creator.email AS "createdByEmail"',
    createdAt: 'q."createdAt"',
    updatedBy: 'updater.email AS "updatedByEmail"',
    updatedAt: 'q."updatedAt"',
};

module.exports = {
    index: async (req, res, next) => {
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const orderBy = req.query.orderBy || "id";
        const orderDir = req.query.orderDir || "DESC";

        try {
            const quoteViews = await quoteViewsService.pluck(["name"]);

            let columns = 'q."isActive",';
            let headers = [];
            for (const quoteView of quoteViews) {
                const column = columnsObj[quoteView.name];
                if (column) {
                    columns += `${column},`;
                    headers.push(quoteView.name);
                }
            }

            // TEMP: Track the issue
            // https://github.com/porsager/postgres/issues/894
            columns = columns.endsWith(",") ? columns.slice(0, -1) : columns;

            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                columns,
            };
            const quotes = await quotesService.find(optionsObj);
            const { count } = await quotesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/quotes",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("quotes/index", {
                title: capitalize(req.session.labels.module.quote),
                quotes,
                paginationLinks,
                search,
                count,
                orderBy,
                orderDir,
                headers,
            });
        } catch (err) {
            next(err);
        }
    },

    new: async (req, res, next) => {
        const companyId = req.query.companyId;
        const contactId = req.query.contactId;
        const dealId = req.query.dealId;

        return res.render("quotes/new", {
            title:
                "New " +
                pluralize.singular(
                    req.session.labels.module.quote.toLowerCase()
                ),
            companyId,
            contactId,
            dealId,
        });
    },

    create: async (req, res, next) => {
        const { name, total, description, companyId, contactId, dealId } =
            req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            res.redirect(`/quotes/new`);
            return;
        }

        try {
            const quoteObj = {
                name,
                total,
                description,
                companyId: companyId || null,
                contactId: contactId || null,
                dealId: dealId || null,
                createdBy: req.session.currentUser.id,
            };

            const resp = await quotesService.create(quoteObj);
            req.flash("info", `${resp.name} is created.`);

            if (companyId) {
                return res.redirect(`/companies/${companyId}`);
            } else if (contactId) {
                return res.redirect(`/contacts/${contactId}`);
            } else if (dealId) {
                return res.redirect(`/deals/${dealId}`);
            } else {
                return res.redirect("/quotes");
            }
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            // Get all associated tasks.
            const optionsObj = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                quoteId: quote.id,
                columns: [
                    "t.id",
                    "t.name",
                    'updater.email AS "updatedByEmail"',
                    't."updatedAt"',
                ],
            };
            const tasks = await tasksService.find(optionsObj);

            // Get all comments.
            const comments = await quoteCommentsService.findOne(id);

            // Get all files.
            const files = await quoteFilesService.findOne(id);

            return res.render("quotes/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.quote.toLowerCase()
                    ),
                quote,
                tasks,
                comments,
                files,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            return res.render("quotes/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.quote.toLowerCase()
                    ),
                quote,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name, total, description } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/quotes/${id}/edit`);
        }

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            const quoteObj = {
                id,
                name,
                total,
                description,
                updatedBy: req.session.currentUser.id,
            };
            await quotesService.update(quoteObj);

            req.flash("info", "Quote is updated.");
            return res.redirect(`/quotes/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            await quotesService.destroy(id);

            req.flash("info", "Quote is deleted.");
            return res.redirect("/quotes");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            const quoteObj = { id, updatedBy: req.session.currentUser.id };
            await quotesService.archive(quoteObj);

            req.flash("info", "Quote is archived.");
            return res.redirect(`/quotes/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            const quoteObj = { id, updatedBy: req.session.currentUser.id };
            await quotesService.active(quoteObj);

            req.flash("info", "Quote is activated.");
            return res.redirect(`/quotes/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
