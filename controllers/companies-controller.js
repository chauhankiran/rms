const notFound = require("../errors/not-found");
const companiesService = require("../services/companies-service");
const companyCommentsService = require("../services/company-comments-service");
const companyFilesService = require("../services/company-files-service");
const contactsService = require("../services/contacts-service");
const companyViewsService = require("../services/company-views-service");
const labelsService = require("../services/admin/labels-service");
const refsService = require("../services/admin/refs-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const dealsService = require("../services/deals-service");
const quotesService = require("../services/quotes-service");
const ticketsService = require("../services/tickets-service");
const tasksService = require("../services/tasks-service");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");
const locales = require("../locales/en");
const message = require("../helpers/message");
const { PER_PAGE } = require("../constants/app");

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
        as: "c.name",
        alias: "name",
    },
    companySourceId: {
        as: 'cs.name AS "companySource"',
        alias: "companySource",
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
    employeeSize: {
        as: 'c."employeeSize"',
        alias: "employeeSize",
    },
    description: {
        as: "c.description",
        alias: "description",
    },
};

module.exports = {
    index: async (req, res, next) => {
        const search = req.query.search || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || PER_PAGE;
        const skip = (page - 1) * limit;
        const orderBy = req.query.orderBy || "id";
        const orderDir = req.query.orderDir || "DESC";

        try {
            // Run the query to fetch the fields.
            let fields = await companyViewsService.find(req.session.currentUser.id);

            // If somehow, view is not set for the user, go with these fields.
            if (fields.length === 0) {
                fields = [
                    { name: "id" },
                    { name: "name" },
                    { name: "createdBy" },
                    { name: "createdAt" },
                ];
            }

            // Create SQL query and columns array based on fields.
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
            const isActiveOnly = req.session.currentUser.type === "user" ? true : false;

            // Fetch companies.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
                isActiveOnly,
            };
            const companies = await companiesService.find(optionsObj);
            const { count } = await companiesService.count(optionsObj);

            // Generate pagination links for buttons.
            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/companies",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render
            return res.render("companies/index", {
                title: capitalize(req.session.labels.module.company),
                companies,
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
        try {
            const companySources = await refsService.pluck("companySources", ["id", "name"]);
            const states = await refsService.pluck("states", ["id", "name"]);
            const countries = await refsService.pluck("countries", ["id", "name"]);
            const industries = await refsService.pluck("industries", ["id", "name"]);
            const sources = await refsService.pluck("sources", ["id", "name"]);
            const statuses = await refsService.pluck("statuses", ["id", "name"]);
            const stages = await refsService.pluck("stages", ["id", "name"]);
            const types = await refsService.pluck("types", ["id", "name"]);

            return res.render("companies/new", {
                title: "New " + pluralize.singular(req.session.labels.module.company.toLowerCase()),
                companySources,
                states,
                countries,
                industries,
                sources,
                statuses,
                stages,
                types,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const {
            name,
            employeeSize,
            website,
            email,
            phone,
            mobile,
            fax,
            address1,
            address2,
            city,
            stateId,
            zip,
            countryId,
            sourceId,
            statusId,
            stageId,
            industryId,
            closeDate,
            closeReason,
            assigneeId,
            revenue,
            typeId,
            description,
            companySourceId,
        } = req.body;

        if (!name) {
            req.flash("error", locales.company.nameRequired);
            return res.redirect(`/companies/new`);
        }
        try {
            const companyObj = {
                name,
                employeeSize: employeeSize || 0,
                description,
                companySourceId,
                website: website || null,
                email: email || null,
                phone: phone || null,
                mobile: mobile || null,
                fax: fax || null,
                address1: address1 || null,
                address2: address2 || null,
                city: city || null,
                stateId: stateId || null,
                zip: zip || null,
                countryId: countryId || null,
                sourceId: sourceId || null,
                statusId: statusId || null,
                stageId: stageId || null,
                industryId: industryId || null,
                closeDate: closeDate || null,
                closeReason: closeReason || null,
                assigneeId: assigneeId || null,
                revenue: revenue || null,
                typeId: typeId || null,
                createdBy: req.session.currentUser.id,
            };
            const resp = await companiesService.create(companyObj);
            req.flash("info", message(locales.company.created, { name: resp.name }));
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            let contacts, deals, quotes, tickets, tasks;

            const company = await companiesService.findOne(id);

            // Get all associated contacts.
            if (req.session.modules.contact) {
                const optionsObj = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    companyId: company.id,
                    query: [
                        "c.id",
                        'c."firstName"',
                        'c."lastName"',
                        'c."updatedAt"',
                        'updater.email AS "updatedByEmail"',
                    ],
                };
                contacts = await contactsService.find(optionsObj);
            }

            // Get all associated deals.
            if (req.session.modules.deal) {
                const optionsObj2 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    companyId: company.id,
                    query: ["d.id", "d.name", 'updater.email AS "updatedByEmail"', 'd."updatedAt"'],
                };
                deals = await dealsService.find(optionsObj2);
            }

            // Get all associated quotes.
            if (req.session.modules.quote) {
                const optionsObj3 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    companyId: company.id,
                    query: ["q.id", "q.name", 'updater.email AS "updatedByEmail"', 'q."updatedAt"'],
                };
                quotes = await quotesService.find(optionsObj3);
            }

            // Get all associated tickets.
            if (req.session.modules.ticket) {
                const optionsObj4 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    companyId: company.id,
                    query: ["t.id", "t.name", 'updater.email AS "updatedByEmail"', 't."updatedAt"'],
                };
                tickets = await ticketsService.find(optionsObj4);
            }

            // Get all associated tasks.
            if (req.session.modules.task) {
                const optionsObj5 = {
                    skip: 0,
                    limit: 100,
                    orderBy: "id",
                    orderDir: "DESC",
                    companyId: company.id,
                    query: ["t.id", "t.name", 'updater.email AS "updatedByEmail"', 't."updatedAt"'],
                };
                tasks = await tasksService.find(optionsObj5);
            }

            // Get all comments.
            const comments = await companyCommentsService.findOne(id);

            // Get all files.
            const files = await companyFilesService.findOne(id);

            return res.render("companies/show", {
                title: company.name,
                company,
                contacts,
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
            const company = await companiesService.findOne(id);

            const companySources = await refsService.pluck("companySources", ["id", "name"]);
            const states = await refsService.pluck("states", ["id", "name"]);
            const countries = await refsService.pluck("countries", ["id", "name"]);
            const industries = await refsService.pluck("industries", ["id", "name"]);
            const sources = await refsService.pluck("sources", ["id", "name"]);
            const statuses = await refsService.pluck("statuses", ["id", "name"]);
            const stages = await refsService.pluck("stages", ["id", "name"]);
            const types = await refsService.pluck("types", ["id", "name"]);

            return res.render("companies/edit", {
                title:
                    "Edit " + pluralize.singular(req.session.labels.module.company.toLowerCase()),
                company,
                companySources,
                states,
                countries,
                industries,
                sources,
                statuses,
                stages,
                types,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const {
            name,
            employeeSize,
            description,
            companySourceId,
            website,
            email,
            phone,
            mobile,
            fax,
            address1,
            address2,
            city,
            stateId,
            zip,
            countryId,
            sourceId,
            statusId,
            stageId,
            industryId,
            closeDate,
            closeReason,
            assigneeId,
            revenue,
            typeId,
        } = req.body;

        if (!name) {
            req.flash("error", locales.company.nameRequired);
            return res.redirect(`/companies/${id}/edit`);
        }
        try {
            const companyObj = {
                id,
                name,
                employeeSize: employeeSize || null,
                description,
                companySourceId,
                website: website || null,
                email: email || null,
                phone: phone || null,
                mobile: mobile || null,
                fax: fax || null,
                address1: address1 || null,
                address2: address2 || null,
                city: city || null,
                stateId: stateId || null,
                zip: zip || null,
                countryId: countryId || null,
                sourceId: sourceId || null,
                statusId: statusId || null,
                stageId: stageId || null,
                industryId: industryId || null,
                closeDate: closeDate || null,
                closeReason: closeReason || null,
                assigneeId: assigneeId || null,
                revenue: revenue || null,
                typeId: typeId || null,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await companiesService.update(companyObj);

            req.flash("info", message(locales.company.updated, { name: resp.name }));
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const resp = await companiesService.destroy(id);

            req.flash("info", message(locales.company.deleted, { name: resp.name }));
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const companyObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await companiesService.archive(companyObj);

            req.flash("info", message(locales.company.archived, { name: resp.name }));
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const companyObj = {
                id,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await companiesService.active(companyObj);

            req.flash("info", message(locales.company.activated, { name: resp.name }));
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await labelsService.pluck("companyLabels", ["name"]);
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await companyViewsService.find(req.session.currentUser.id);
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("companies/view", {
            title: "Change view for companies",
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
            await companyViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await companyViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", locales.view.updated);
            res.redirect("/companies");
            return;
        } catch (err) {
            next(err);
        }
    },
};
