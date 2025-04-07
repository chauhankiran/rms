const notFound = require("../errors/not-found");
const companiesService = require("../services/companies-service");
const companyCommentsService = require("../services/company-comments-service");
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

const columnsObj = {
    id: "c.id",
    name: "c.name",
    companySourceId: 'cs.name AS "companySource"',
    createdBy: 'creator.email AS "createdByEmail"',
    createdAt: 'c."createdAt"',
    updatedBy: 'updater.email AS "updatedByEmail"',
    updatedAt: 'c."updatedAt"',
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
            const companyViews = await companyViewsService.pluck(["name"]);

            let columns = 'c."isActive",';
            let headers = [];
            for (const companyView of companyViews) {
                const column = columnsObj[companyView.name];
                if (column) {
                    columns += `${column},`;
                    headers.push(companyView.name);
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
            const companies = await companiesService.find(optionsObj);
            const { count } = await companiesService.count(optionsObj);

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

            return res.render("companies/index", {
                title: capitalize(req.session.labels.module.company),
                companies,
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
            await companiesService.create(companyObj);

            req.flash("info", "Company is created.");
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
};
