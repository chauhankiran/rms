const notFound = require("../errors/not-found");
const ticketsService = require("../services/tickets-service");
const ticketCommentsService = require("../services/ticket-comments-service");
const ticketFilesService = require("../services/ticket-files-service");
const ticketViewsService = require("../services/ticket-views-service");
const ticketTypesService = require("../services/admin/ticket-types-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");

const columnsObj = {
    id: "t.id",
    name: "t.name",
    ticketTypeId: 'tt.name AS "ticketType"',
    createdBy: 'creator.email AS "createdByEmail"',
    createdAt: 't."createdAt"',
    updatedBy: 'updater.email AS "updatedByEmail"',
    updatedAt: 't."updatedAt"',
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
            const ticketViews = await ticketViewsService.pluck(["name"]);

            let columns = 't."isActive",';
            let headers = [];
            for (const ticketView of ticketViews) {
                const column = columnsObj[ticketView.name];
                if (column) {
                    columns += `${column},`;
                    headers.push(ticketView.name);
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
            const tickets = await ticketsService.find(optionsObj);
            const { count } = await ticketsService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/tickets",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("tickets/index", {
                title: capitalize(req.session.labels.module.ticket),
                tickets,
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
            req.flash("error", "Name is required.");
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
            req.flash("info", `${resp.name} is created.`);

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
            const ticket = await ticketsService.findOne(id);

            if (!ticket) {
                return next(notFound());
            }

            // Get all associated tasks.
            const optionsObj = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                ticketId: ticket.id,
                columns: [
                    "t.id",
                    "t.name",
                    'updater.email AS "updatedByEmail"',
                    't."updatedAt"',
                ],
            };
            const tasks = await tasksService.find(optionsObj);

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
            req.flash("error", "Name is required.");
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

            req.flash("info", "Ticket is updated.");
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

            req.flash("info", "Ticket is deleted.");
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

            req.flash("info", "Ticket is archived.");
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

            req.flash("info", "Ticket is activated.");
            return res.redirect(`/tickets/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
