const notFound = require("../errors/not-found");
const quotesService = require("../services/quotes-service");
const quoteCommentsService = require("../services/quote-comments-service");
const quoteFilesService = require("../services/quote-files-service");
const quoteViewsService = require("../services/quote-views-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");
const sql = require("../db/sql");

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
            const fields = await sql`
                SELECT
                    id,
                    name
                FROM
                    "quoteViews"
                WHERE
                    "userId" = ${req.session.currentUser.id}
            `;

            // Create SQL query based on fields.
            let query = 'q."isActive",';
            const columns = [];
            for (const field of fields) {
                const column = columnsObj[field.name];
                if (column) {
                    query += `${column.as},`;
                    columns.push({
                        header: req.session.labels.quote[field.name],
                        field: column.alias,
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

            // TEMP.
            // select all view fields to support "view change".
            // TODO: Move this somewhere else.
            const viewFields = await sql`
                SELECT
                    id,
                    name,
                    "displayName"
                FROM
                    "quoteLabels"
                WHERE
                    "isActive" = TRUE
            `;

            return res.render("quotes/index", {
                title: capitalize(req.session.labels.module.quote),
                quotes,
                paginationLinks,
                search,
                count,
                orderBy,
                orderDir,
                viewFields,
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

    viewFields: async (req, res, next) => {
        const fields = req.body.fields || [];

        await sql`
            DELETE FROM
                "quoteViews"
            WHERE
                "userId" = ${req.session.currentUser.id}
        `;

        for (const field of fields) {
            await sql`
                INSERT INTO
                    "quoteViews" ("userId", "name")
                VALUES
                    (${req.session.currentUser.id}, ${field})
            `;
        }

        res.redirect("/quotes");
    },
};
