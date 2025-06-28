const notFound = require("../errors/not-found");
const ticketsService = require("../services/tickets-service");
const ticketCommentsService = require("../services/ticket-comments-service");
const ticketFilesService = require("../services/ticket-files-service");
const ticketViewsService = require("../services/ticket-views-service");
const ticketLabelsService = require("../services/ticket-labels-service");
const ticketTypesService = require("../services/admin/ticket-types-service");
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
        as: "t.id",
        alias: "id",
    },
    name: {
        as: "t.name",
        alias: "name",
    },
    ticketTypeId: {
        as: 'tt.name AS "ticketType"',
        alias: "ticketType",
    },
    createdBy: {
        as: 'creator.email AS "createdByEmail"',
        alias: "createdByEmail",
    },
    createdAt: {
        as: 't."createdAt"',
        alias: "createdAt",
    },
    updatedBy: {
        as: 'updater.email AS "updatedByEmail"',
        alias: "updatedByEmail",
    },
    updatedAt: {
        as: 't."updatedAt"',
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
            let fields = await ticketViewsService.find(
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
            let query = 't."isActive",';
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
            const tickets = await ticketsService.find(optionsObj);
            const { count } = await ticketsService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            // Generate pagination links for buttons.
            const paginationLinks = generatePaginationLinks({
                link: "/tickets",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render.
            return res.render("tickets/index", {
                title: capitalize(req.session.labels.module.ticket),
                tickets,
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

        try {
            const ticketTypes = await ticketTypesService.pluck(["id", "name"]);

            return res.render("tickets/new", {
                title:
                    "New " +
                    pluralize.singular(
                        req.session.labels.module.ticket.toLowerCase()
                    ),
                ticketTypes,
                companyId,
                contactId,
                dealId,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const {
            name,
            description,
            ticketTypeId,
            companyId,
            contactId,
            dealId,
        } = req.body;

        if (!name) {
            req.flash("error", locales.ticket.nameRequired);
            return res.redirect(`/tickets/new`);
        }
        try {
            const ticketObj = {
                name,
                description,
                ticketTypeId,
                companyId: companyId || null,
                contactId: contactId || null,
                dealId: dealId || null,
                createdBy: req.session.currentUser.id,
            };

            const resp = await ticketsService.create(ticketObj);
            req.flash(
                "info",
                message(locales.ticket.created, { name: resp.name })
            );

            if (companyId) {
                return res.redirect(`/companies/${companyId}`);
            } else if (contactId) {
                return res.redirect(`/contacts/${contactId}`);
            } else if (dealId) {
                return res.redirect(`/deals/${dealId}`);
            } else {
                return res.redirect("/tickets");
            }
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            let tasks;

            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            // Get all associated tasks.
            if (req.session.modules.task) {
                const optionsObj = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    ticketId: ticket.id,
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
            const comments = await ticketCommentsService.findOne(id);

            // Get all files.
            const files = await ticketFilesService.findOne(id);

            return res.render("tickets/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.ticket.toLowerCase()
                    ),
                ticket,
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
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            const ticketTypes = await ticketTypesService.pluck(["id", "name"]);

            return res.render("tickets/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.ticket.toLowerCase()
                    ),
                ticket,
                ticketTypes,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name, description, ticketTypeId } = req.body;

        if (!name) {
            req.flash("error", locales.ticket.nameRequired);
            return res.redirect(`/tickets/${id}/edit`);
        }
        try {
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            const ticketObj = {
                id,
                name,
                description,
                ticketTypeId,
                updatedBy: req.session.currentUser.id,
            };
            await ticketsService.update(ticketObj);

            req.flash("info", locales.ticket.updated);
            return res.redirect(`/tickets/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            await ticketsService.destroy(id);

            req.flash("info", locales.ticket.deleted);
            return res.redirect("/tickets");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            const ticketObj = { id, updatedBy: req.session.currentUser.id };
            await ticketsService.archive(ticketObj);

            req.flash("info", locales.ticket.archived);
            return res.redirect(`/tickets/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            const ticketObj = { id, updatedBy: req.session.currentUser.id };
            await ticketsService.active(ticketObj);

            req.flash("info", locales.ticket.activated);
            return res.redirect(`/tickets/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await ticketLabelsService.find();
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await ticketViewsService.find(
            req.session.currentUser.id
        );
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("tickets/view", {
            title: "Change view for tickets",
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
            await ticketViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await ticketViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", locales.view.updatedTickets);
            res.redirect("/tickets");
            return;
        } catch (err) {
            next(err);
        }
    },
};
