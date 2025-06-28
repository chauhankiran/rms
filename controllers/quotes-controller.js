const notFound = require("../errors/not-found");
const quotesService = require("../services/quotes-service");
const quoteCommentsService = require("../services/quote-comments-service");
const quoteFilesService = require("../services/quote-files-service");
const quoteViewsService = require("../services/quote-views-service");
const quoteLabelsService = require("../services/quote-labels-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");
const locales = require("../locales/en");
const message = require("../helpers/message");

// columnsObj contains list of field companies can have.
// key in object is name of the field (used to fetch label).
// as is for selecting that field value in SQL SELECT statement.
// alias is for selecting the field value that is returned by SQL SELECT statement.
const columnsObj = {
    id: {
        as: "q.id",
        alias: "id",
    },
    name: {
        as: "q.name",
        alias: "name",
    },
    total: {
        as: "q.total",
        alias: "total",
    },
    createdBy: {
        as: 'creator.email AS "createdByEmail"',
        alias: "createdByEmail",
    },
    createdAt: {
        as: 'q."createdAt"',
        alias: "createdAt",
    },
    updatedBy: {
        as: 'updater.email AS "updatedByEmail"',
        alias: "updatedByEmail",
    },
    updatedAt: {
        as: 'q."updatedAt"',
        alias: "updatedAt",
    },
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
            // Run the query to fetch the fields.
            let fields = await quoteViewsService.find(
                req.session.currentUser.id
            );

            // If somehow, view is not set for the user, go with these fields.
            if (fields.length === 0) {
                fields = [
                    { name: "id" },
                    { name: "name" },
                    { name: "createdBy" },
                    { name: "createdAt" },
                ];
            }

            // Create SQL query based on fields.
            let query = 'q."isActive",';
            const columns = [];
            for (const field of fields) {
                const column = columnsObj[field.name];
                if (column) {
                    query += `${column.as},`;
                    columns.push({
                        field: field.name,
                        alias: column.alias,
                    });
                }
            }
            // TEMP: Track the issue
            // https://github.com/porsager/postgres/issues/894
            query = query.endsWith(",") ? query.slice(0, -1) : query;

            // Fetch quotes.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
            };
            const quotes = await quotesService.find(optionsObj);
            const { count } = await quotesService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            // Generate pagination links for buttons.
            const paginationLinks = generatePaginationLinks({
                link: "/quotes",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render.
            return res.render("quotes/index", {
                title: capitalize(req.session.labels.module.quote),
                quotes,
                paginationLinks,
                search,
                count,
                orderBy,
                orderDir,
                columns,
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
            req.flash("error", locales.quote.nameRequired);
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
            req.flash(
                "info",
                message(locales.quote.created, { name: resp.name })
            );

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
            let tasks;

            const quote = await quotesService.findOne(id);

            if (!quote) {
                return next(notFound());
            }

            // Get all associated tasks.
            if (req.session.modules.task) {
                const optionsObj = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    quoteId: quote.id,
                    query: [
                        "t.id",
                        "t.name",
                        'updater.email AS "updatedByEmail"',
                        't."updatedAt"',
                    ],
                };
                tasks = await tasksService.find(optionsObj);
            }

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
            req.flash("error", locales.quote.nameRequired);
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

            req.flash("info", locales.quote.updated);
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

            req.flash("info", locales.quote.deleted);
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

            req.flash("info", locales.quote.archived);
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

            req.flash("info", locales.quote.activated);
            return res.redirect(`/quotes/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await quoteLabelsService.find();
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await quoteViewsService.find(
            req.session.currentUser.id
        );
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("quotes/view", {
            title: "Change view for quotes",
            availableFields,
            selectedFields,
        });
    },

    view: async (req, res, next) => {
        let fields = req.body.fields;
        if (fields) {
            fields = fields.split(",");
        }

        try {
            //
            // Create a view for given user by
            //   1. Delete all the fields
            //   2. Insert selected fields.

            // 1. Delete all the fields.
            await quoteViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await quoteViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", locales.view.updatedQuotes);
            res.redirect("/quotes");
            return;
        } catch (err) {
            next(err);
        }
    },
};
