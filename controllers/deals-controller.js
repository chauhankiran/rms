const notFound = require("../errors/not-found");
const dealsService = require("../services/deals-service");
const dealCommentsService = require("../services/deal-comments-service");
const dealFilesService = require("../services/deal-files-service");
const dealViewsService = require("../services/deal-views-service");
const dealLabelsService = require("../services/deal-labels-service");
const dealSourcesService = require("../services/admin/deal-sources-service");
const quotesService = require("../services/quotes-service");
const ticketsService = require("../services/tickets-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");

// columnsObj contains list of field companies can have.
// key in object is name of the field (used to fetch label).
// as is for selecting that field value in SQL SELECT statement.
// alias is for selecting the field value that is returned by SQL SELECT statement.
const columnsObj = {
    id: {
        as: "d.id",
        alias: "id",
    },
    name: {
        as: "d.name",
        alias: "name",
    },
    total: {
        as: "d.total",
        alias: "total",
    },
    dealSourceId: {
        as: 'ds.name AS "dealSource"',
        alias: "dealSource",
    },
    createdBy: {
        as: 'creator.email AS "createdByEmail"',
        alias: "createdByEmail",
    },
    createdAt: {
        as: 'd."createdAt"',
        alias: "createdAt",
    },
    updatedBy: {
        as: 'updater.email AS "updatedByEmail"',
        alias: "updatedByEmail",
    },
    updatedAt: {
        as: 'd."updatedAt"',
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
            let fields = await dealViewsService.find(
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
            let query = 'd."isActive",';
            const columns = [];
            for (const field of fields) {
                const column = columnsObj[field.name];
                if (column) {
                    query += `${column.as},`;
                    columns.push({
                        header: req.session.labels.deal[field.name],
                        field: column.alias,
                    });
                }
            }
            // TEMP: Track the issue
            // https://github.com/porsager/postgres/issues/894
            query = query.endsWith(",") ? query.slice(0, -1) : query;

            // Check user type. If type == "user" only fetch active tasks.
            // If type === "admin", then show all the tasks.
            const isActiveOnly =
                req.session.currentUser.type === "user" ? true : false;

            // Fetch deals.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
                isActiveOnly,
            };
            const deals = await dealsService.find(optionsObj);
            const { count } = await dealsService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            // Generate pagination links for buttons.
            const paginationLinks = generatePaginationLinks({
                link: "/deals",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render.
            return res.render("deals/index", {
                title: capitalize(req.session.labels.module.deal),
                deals,
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

        try {
            const dealSources = await dealSourcesService.pluck(["id", "name"]);

            return res.render("deals/new", {
                title:
                    "New " +
                    pluralize.singular(
                        req.session.labels.module.deal.toLowerCase()
                    ),
                dealSources,
                companyId,
                contactId,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const { name, total, description, dealSourceId, companyId, contactId } =
            req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/deals/new`);
        }

        try {
            const dealObj = {
                name,
                total,
                description,
                dealSourceId,
                companyId: companyId || null,
                contactId: contactId || null,
                createdBy: req.session.currentUser.id,
            };

            const resp = await dealsService.create(dealObj);
            req.flash("info", `${resp.name} is created.`);

            if (companyId) {
                return res.redirect(`/companies/${companyId}`);
            } else if (contactId) {
                return res.redirect(`/contacts/${contactId}`);
            } else {
                return res.redirect("/deals");
            }
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            let quotes, tickets, tasks;

            const deal = await dealsService.findOne(id);

            if (!deal) {
                return next(notFound());
            }

            // Get all associated quotes.
            if (req.session.modules.quote) {
                const optionsObj = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    dealId: deal.id,
                    query: [
                        "q.id",
                        "q.name",
                        'updater.email AS "updatedByEmail"',
                        'q."updatedAt"',
                    ],
                };
                quotes = await quotesService.find(optionsObj);
            }

            // Get all associated tickets.
            if (req.session.modules.ticket) {
                const optionsObj2 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    dealId: deal.id,
                    query: [
                        "t.id",
                        "t.name",
                        'updater.email AS "updatedByEmail"',
                        't."updatedAt"',
                    ],
                };
                tickets = await ticketsService.find(optionsObj2);
            }

            // Get all associated tasks.
            if (req.session.modules.task) {
                const optionsObj3 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    dealId: deal.id,
                    query: [
                        "t.id",
                        "t.name",
                        'updater.email AS "updatedByEmail"',
                        't."updatedAt"',
                    ],
                };
                tasks = await tasksService.find(optionsObj3);
            }

            // Get all comments.
            const comments = await dealCommentsService.findOne(id);

            // Get all files.
            const files = await dealFilesService.findOne(id);

            return res.render("deals/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.deal.toLowerCase()
                    ),
                deal,
                quotes,
                tickets,
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
            const deal = await dealsService.findOne(id);

            if (!deal) {
                return next(notFound());
            }

            const dealSources = await dealSourcesService.pluck(["id", "name"]);

            return res.render("deals/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.deal.toLowerCase()
                    ),
                deal,
                dealSources,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name, total, description, dealSourceId } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/deals/${id}/edit`);
        }

        try {
            const deal = await dealsService.findOne(id);

            if (!deal) {
                return next(notFound());
            }

            const dealObj = {
                id,
                name,
                total,
                description,
                dealSourceId,
                updatedBy: req.session.currentUser.id,
            };
            await dealsService.update(dealObj);

            req.flash("info", "Deal is updated.");
            return res.redirect(`/deals/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const deal = await dealsService.findOne(id);

            if (!deal) {
                return next(notFound());
            }

            await dealsService.destroy(id);

            req.flash("info", "Deal is deleted.");
            return res.redirect("/deals");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const deal = await dealsService.findOne(id);

            if (!deal) {
                req.flash("error", "Deal not found.");
                return res.redirect("/deals");
            }

            const dealObj = { id, updatedBy: req.session.currentUser.id };
            await dealsService.archive(dealObj);

            req.flash("info", "Deal is archived.");
            return res.redirect(`/deals/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const deal = await dealsService.findOne(id);

            if (!deal) {
                return next(notFound());
            }

            const dealObj = { id, updatedBy: req.session.currentUser.id };
            await dealsService.active(dealObj);

            req.flash("info", "Deal is activated.");
            return res.redirect(`/deals/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await dealLabelsService.find();
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await dealViewsService.find(
            req.session.currentUser.id
        );
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("deals/view", {
            title: "Change view for deals",
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
            await dealViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await dealViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", "View is updated for deals.");
            res.redirect("/deals");
            return;
        } catch (err) {
            next(err);
        }
    },
};
