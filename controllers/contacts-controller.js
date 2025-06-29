const notFound = require("../errors/not-found");
const contactsService = require("../services/contacts-service");
const contactCommentsService = require("../services/contact-comments-service");
const contactFilesService = require("../services/contact-files-service");
const contactViewsService = require("../services/contact-views-service");
const contactLabelsService = require("../services/contact-labels-service");
const refsService = require("../services/admin/refs-service");
const dealsService = require("../services/deals-service");
const quotesService = require("../services/quotes-service");
const ticketsService = require("../services/tickets-service");
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
        as: "c.id",
        alias: "id",
    },
    name: {
        as: 'c.prefix, c."firstName", c."lastName"',
        alias: "name",
    },
    prefix: {
        as: "c.prefix",
        alias: "prefix",
    },
    firstName: {
        as: 'c."firstName"',
        alias: "firstName",
    },
    lastName: {
        as: 'c."lastName"',
        alias: "lastName",
    },
    contactIndustryId: {
        as: 'ci.name AS "contactIndustry"',
        alias: "contactIndustry",
    },
    annualRevenue: {
        as: 'c."annualRevenue"',
        alias: "annualRevenue",
    },
    createdBy: {
        as: 'creator.email AS "createdByEmail"',
        alias: "createdByEmail",
    },
    createdAt: {
        as: 'c."createdAt"',
        alias: "createdAt",
    },
    updatedBy: {
        as: 'updater.email AS "updatedByEmail"',
        alias: "updatedByEmail",
    },
    updatedAt: {
        as: 'c."updatedAt"',
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
            let fields = await contactViewsService.find(
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
            let query = 'c."isActive",';
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

            // Fetch contacts.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
                isActiveOnly,
            };
            const contacts = await contactsService.find(optionsObj);
            const { count } = await contactsService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            // Generate pagination links for buttons.
            const paginationLinks = generatePaginationLinks({
                link: "/contacts",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render.
            return res.render("contacts/index", {
                title: capitalize(req.session.labels.module.contact),
                contacts,
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

        try {
            const contactIndustries = await refsService.pluck(
                "contactIndustries",
                ["id", "name"]
            );

            return res.render("contacts/new", {
                title:
                    "New " +
                    pluralize.singular(
                        req.session.labels.module.contact.toLowerCase()
                    ),
                contactIndustries,
                companyId,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const {
            prefix,
            firstName,
            lastName,
            annualRevenue,
            description,
            contactIndustryId,
            companyId,
        } = req.body;

        if (!firstName) {
            req.flash("error", locales.contact.firstNameRequired);
            res.redirect(`/contacts/new`);
            return;
        }

        if (!lastName) {
            req.flash("error", locales.contact.lastNameRequired);
            res.redirect(`/contacts/new`);
            return;
        }

        try {
            const contactObj = {
                prefix,
                firstName,
                lastName,
                annualRevenue,
                description,
                contactIndustryId,
                companyId: companyId || null,
                createdBy: req.session.currentUser.id,
            };
            const resp = await contactsService.create(contactObj);
            req.flash(
                "info",
                message(locales.contact.created, {
                    firstName: resp.firstName,
                    lastName: resp.lastName,
                })
            );

            if (companyId) {
                return res.redirect(`/companies/${companyId}`);
            } else {
                return res.redirect("/contacts");
            }
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            let deals, quotes, tickets, tasks;

            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            // Get all associated deals.
            if (req.session.modules.contact) {
                const optionsObj = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    contactId: contact.id,
                    query: [
                        "d.id",
                        "d.name",
                        'updater.email AS "updatedByEmail"',
                        'd."updatedAt"',
                    ],
                };
                deals = await dealsService.find(optionsObj);
            }

            // Get all associated quotes.
            if (req.session.modules.quote) {
                const optionsObj2 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    contactId: contact.id,
                    query: [
                        "q.id",
                        "q.name",
                        'updater.email AS "updatedByEmail"',
                        'q."updatedAt"',
                    ],
                };
                quotes = await quotesService.find(optionsObj2);
            }

            // Get all associated tickets.
            if (req.session.modules.ticket) {
                const optionsObj3 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    contactId: contact.id,
                    query: [
                        "t.id",
                        "t.name",
                        'updater.email AS "updatedByEmail"',
                        't."updatedAt"',
                    ],
                };
                tickets = await ticketsService.find(optionsObj3);
            }

            // Get all associated tasks.
            if (req.session.modules.task) {
                const optionsObj4 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    contactId: contact.id,
                    query: [
                        "t.id",
                        "t.name",
                        'updater.email AS "updatedByEmail"',
                        't."updatedAt"',
                    ],
                };
                tasks = await tasksService.find(optionsObj4);
            }

            // Get all comments.
            const comments = await contactCommentsService.findOne(id);

            // Get all files.
            const files = await contactFilesService.findOne(id);

            return res.render("contacts/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.contact.toLowerCase()
                    ),
                contact,
                deals,
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
            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            const contactIndustries = await refsService.pluck(
                "contactIndustries",
                ["id", "name"]
            );

            return res.render("contacts/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.contact.toLowerCase()
                    ),
                contact,
                contactIndustries,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const {
            prefix,
            firstName,
            lastName,
            annualRevenue,
            description,
            contactIndustryId,
        } = req.body;

        if (!firstName) {
            req.flash("error", locales.contact.firstNameRequired);
            return res.redirect(`/contacts/${id}/edit`);
        }

        if (!lastName) {
            req.flash("error", locales.contact.lastNameRequired);
            return res.redirect(`/contacts/${id}/edit`);
        }

        try {
            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            const contactObj = {
                id,
                prefix,
                firstName,
                lastName,
                annualRevenue,
                description,
                contactIndustryId,
                updatedBy: req.session.currentUser.id,
            };
            await contactsService.update(contactObj);

            req.flash("info", locales.contact.updated);
            return res.redirect(`/contacts/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            await contactsService.destroy(id);

            req.flash("info", locales.contact.deleted);
            return res.redirect("/contacts");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            const contactObj = { id, updatedBy: req.session.currentUser.id };
            await contactsService.archive(contactObj);

            req.flash("info", locales.contact.archived);
            return res.redirect(`/contacts/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const contact = await contactsService.findOne(id);

            if (!contact) {
                return next(notFound());
            }

            const contactObj = { id, updatedBy: req.session.currentUser.id };
            await contactsService.active(contactObj);

            req.flash("info", locales.contact.activated);
            return res.redirect(`/contacts/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await contactLabelsService.find();
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await contactViewsService.find(
            req.session.currentUser.id
        );
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("contacts/view", {
            title: "Change view for contacts",
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
            await contactViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await contactViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", locales.view.updatedContacts);
            res.redirect("/contacts");
            return;
        } catch (err) {
            next(err);
        }
    },
};
