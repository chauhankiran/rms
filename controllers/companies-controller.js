const notFound = require("../errors/not-found");
const companiesService = require("../services/companies-service");
const companyCommentsService = require("../services/company-comments-service");
const companyFilesService = require("../services/company-files-service");
const contactsService = require("../services/contacts-service");
const companyViewsService = require("../services/company-views-service");
const companySourcesService = require("../services/admin/company-sources-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const dealsService = require("../services/deals-service");
const quotesService = require("../services/quotes-service");
const ticketsService = require("../services/tickets-service");
const tasksService = require("../services/tasks-service");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");
const sql = require("../db/sql");

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
                    "companyViews"
                WHERE
                    "userId" = ${req.session.currentUser.id}
            `;

            // Create SQL query and columns array based on fields.
            let query = 'c."isActive",';
            const columns = [];
            for (const field of fields) {
                const column = columnsObj[field.name];
                if (column) {
                    query += `${column.as},`;
                    columns.push({
                        header: req.session.labels.company[field.name],
                        field: column.alias,
                    });
                }
            }
            // TEMP: Track the issue
            // https://github.com/porsager/postgres/issues/894
            query = query.endsWith(",") ? query.slice(0, -1) : query;

            // Fetch companies.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
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

            // TEMP.
            // select all view fields to support "view change".
            // TODO: Move this somewhere else.
            const viewFields = await sql`
                SELECT
                    id,
                    name,
                    "displayName"
                FROM
                    "companyLabels"
                WHERE
                    "isActive" = TRUE
            `;

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
                viewFields,
            });
        } catch (err) {
            next(err);
        }
    },

    new: async (req, res, next) => {
        try {
            const companySources = await companySourcesService.pluck([
                "id",
                "name",
            ]);

            return res.render("companies/new", {
                title:
                    "New " +
                    pluralize.singular(
                        req.session.labels.module.company.toLowerCase()
                    ),
                companySources,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const { name, employeeSize, description, companySourceId } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/companies/new`);
        }

        try {
            const companyObj = {
                name,
                employeeSize,
                description,
                companySourceId,
                createdBy: req.session.currentUser.id,
            };
            const resp = await companiesService.create(companyObj);
            req.flash("info", `${resp.name} is created.`);

            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.findOne(id);

            if (!company) {
                return next(notFound());
            }

            // Get all associated contacts.
            const optionsObj = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                companyId: company.id,
                columns: [
                    "c.id",
                    'c."firstName"',
                    'c."lastName"',
                    'c."updatedAt"',
                    'updater.email AS "updatedByEmail"',
                ],
            };
            const contacts = await contactsService.find(optionsObj);

            // Get all associated deals.
            const optionsObj2 = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                companyId: company.id,
                columns: [
                    "d.id",
                    "d.name",
                    'updater.email AS "updatedByEmail"',
                    'd."updatedAt"',
                ],
            };
            const deals = await dealsService.find(optionsObj2);

            // Get all associated quotes.
            const optionsObj3 = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                companyId: company.id,
                columns: [
                    "q.id",
                    "q.name",
                    'updater.email AS "updatedByEmail"',
                    'q."updatedAt"',
                ],
            };
            const quotes = await quotesService.find(optionsObj3);

            // Get all associated tickets.
            const optionsObj4 = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                companyId: company.id,
                columns: [
                    "t.id",
                    "t.name",
                    'updater.email AS "updatedByEmail"',
                    't."updatedAt"',
                ],
            };
            const tickets = await ticketsService.find(optionsObj4);

            // Get all associated tasks.
            const optionsObj5 = {
                skip: 0,
                limit: 100,
                orderBy: "id",
                orderDir: "DESC",
                companyId: company.id,
                columns: [
                    "t.id",
                    "t.name",
                    'updater.email AS "updatedByEmail"',
                    't."updatedAt"',
                ],
            };
            const tasks = await tasksService.find(optionsObj5);

            // Get all comments.
            const comments = await companyCommentsService.findOne(id);

            // Get all files.
            const files = await companyFilesService.findOne(id);

            return res.render("companies/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.company.toLowerCase()
                    ),
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

            if (!company) {
                return next(notFound());
            }

            const companySources = await companySourcesService.pluck([
                "id",
                "name",
            ]);

            return res.render("companies/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.company.toLowerCase()
                    ),
                company,
                companySources,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name, employeeSize, description, companySourceId } = req.body;

        if (!name) {
            req.flash("error", "Name is required.");
            return res.redirect(`/companies/${id}/edit`);
        }

        try {
            const company = await companiesService.findOne(id);

            if (!company) {
                return next(notFound());
            }

            const companyObj = {
                id,
                name,
                employeeSize,
                description,
                companySourceId,
                updatedBy: req.session.currentUser.id,
            };
            await companiesService.update(companyObj);

            req.flash("info", "Company is updated.");
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.findOne(id);

            if (!company) {
                return next(notFound());
            }

            await companiesService.destroy(id);

            req.flash("info", "Company is deleted.");
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.findOne(id);

            if (!company) {
                return next(notFound());
            }

            const companyObj = { id, updatedBy: req.session.currentUser.id };
            await companiesService.archive(companyObj);

            req.flash("info", "Company is archived.");
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.findOne(id);

            if (!company) {
                return next(notFound());
            }

            const companyObj = { id, updatedBy: req.session.currentUser.id };
            await companiesService.active(companyObj);

            req.flash("info", "Company is activated.");
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    viewFields: async (req, res, next) => {
        const fields = req.body.fields || [];

        await sql`
            DELETE FROM
                "companyViews"
            WHERE
                "userId" = ${req.session.currentUser.id}
        `;

        for (const field of fields) {
            await sql`
                INSERT INTO
                    "companyViews" ("userId", "name")
                VALUES
                    (${req.session.currentUser.id}, ${field})
            `;
        }

        res.redirect("/companies");
    },
};
