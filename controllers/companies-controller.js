const generatePaginationLinks = require("../helpers/generate-pagination-links");
const message = require("../helpers/message");
const locales = require("../locales/en");
const companiesService = require("../services/companies-service");
const countriesService = require("../services/countries-service");
const industriesService = require("../services/industries-service");
const sourcesService = require("../services/sources-service");
const stagesService = require("../services/stages-service");
const statesService = require("../services/states-service");
const statusesService = require("../services/statuses-service");
const typesService = require("../services/types-service");

const PER_PAGE = 10;

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
    website: {
        as: "c.website",
        alias: "website",
    },
    email: {
        as: "c.email",
        alias: "email",
    },
    phone: {
        as: "c.phone",
        alias: "phone",
    },
    mobile: {
        as: "c.mobile",
        alias: "mobile",
    },
    fax: {
        as: "c.fax",
        alias: "fax",
    },
    address1: {
        as: "c.address1",
        alias: "address1",
    },
    address2: {
        as: "c.address2",
        alias: "address2",
    },
    city: {
        as: "c.city",
        alias: "city",
    },
    stateId: {
        as: "s.stateName as state",
        alias: "state",
    },
    zip: {
        as: "c.zip",
        alias: "zip",
    },
    countryId: {
        as: "cntry.name AS country",
        alias: "country",
    },
    sourceId: {
        as: "source.name as source",
        alias: "source",
    },
    statusId: {
        as: "status.name as status",
        alias: "status",
    },
    stageId: {
        as: "stage.name as stage",
        alias: "stage",
    },
    industryId: {
        as: "i.name AS industry",
        alias: "industry",
    },
    revenue: {
        as: "c.revenue",
        alias: "revenue",
    },
    createdAt: {
        as: 'c."createdAt"',
        alias: "createdAt",
    },
    updatedAt: {
        as: 'c."updatedAt"',
        alias: "updatedAt",
    },
    employeeSize: {
        as: 'c."employeeSize"',
        alias: "employeeSize",
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
            // TODO: Fetch from database once table is ready.
            const fields = [
                { name: "id" },
                { name: "name" },
                { name: "createdBy" },
                { name: "createdAt" },
            ];

            // Create SQL query and columns array based on fields.
            let query = 'c."life",';
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
            const isActiveOnly = req.session.userRole === 2 ? true : false;

            // Fetch companies.
            const opt = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
                isActiveOnly,
            };

            const companies = await companiesService.find(opt);
            const { count } = await companiesService.count(opt);

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
                title: req.app.locals.helpers.plural(
                    req.session.fields.system.company,
                ),
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
        const orgId = req.session.orgId;

        try {
            const states = await statesService.find({ orgId });
            const countries = await countriesService.find({ orgId });
            const industries = await industriesService.find({ orgId });
            const sources = await sourcesService.find({ orgId });
            const statuses = await statusesService.find({ orgId });
            const stages = await stagesService.find({ orgId });
            const types = await typesService.find({ orgId });

            return res.render("companies/new", {
                title: req.session.fields.system.company,
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
            email,
            website,
            phone,
            mobile,
            telephone,
            fax,
            address1,
            address2,
            city,
            zip,
            stateId,
            countryId,
            industryId,
            revenue,
            employeeSize,
            sourceId,
            statusId,
            stageId,
        } = req.body;

        try {
            const company = await companiesService.create({
                name,
                email,
                website,
                phone,
                mobile,
                telephone,
                fax,
                address1,
                address2,
                city,
                zip,
                stateId: stateId ? stateId : null,
                countryId: countryId ? countryId : null,
                industryId: industryId ? industryId : null,
                revenue,
                employeeSize,
                sourceId: sourceId ? sourceId : null,
                statusId: statusId ? statusId : null,
                stageId: stageId ? stageId : null,
                orgId: req.session.orgId,
                createdBy: req.session.userId,
            });

            req.flash(
                "info",
                message(locales.company.created, { name: company.name }),
            );
            return res.redirect(`/companies/${company.id}`);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.findOne({
                id,
                orgId: req.session.orgId,
            });

            return res.render("companies/show", {
                title: `Show ${req.session.fields.system.company}`,
                company,
            });
        } catch (err) {
            next(err);
        }
    },

    edit: async (req, res, next) => {
        const id = req.params.id;
        const orgId = req.session.orgId;

        try {
            const states = await statesService.find({ orgId });
            const countries = await countriesService.find({ orgId });
            const industries = await industriesService.find({ orgId });
            const sources = await sourcesService.find({ orgId });
            const statuses = await statusesService.find({ orgId });
            const stages = await stagesService.find({ orgId });
            const types = await typesService.find({ orgId });

            const company = await companiesService.findOne({ id, orgId });

            return res.render("companies/edit", {
                title: `Edit ${req.session.fields.system.company}`,
                company,
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
            email,
            website,
            phone,
            mobile,
            telephone,
            fax,
            address1,
            address2,
            city,
            zip,
            stateId,
            countryId,
            industryId,
            revenue,
            employeeSize,
            sourceId,
            statusId,
            stageId,
        } = req.body;

        try {
            const company = await companiesService.update({
                id,
                name,
                email,
                website,
                phone,
                mobile,
                telephone,
                fax,
                address1,
                address2,
                city,
                zip,
                stateId: stateId ? stateId : null,
                countryId: countryId ? countryId : null,
                industryId: industryId ? industryId : null,
                revenue,
                employeeSize,
                sourceId: sourceId ? sourceId : null,
                statusId: statusId ? statusId : null,
                stageId: stageId ? stageId : null,
                orgId: req.session.orgId,
                updatedBy: req.session.userId,
            });

            req.flash(
                "info",
                message(locales.company.updated, { name: company.name }),
            );
            return res.redirect(`/companies/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.destroy({ id });

            req.flash(
                "info",
                message(locales.company.deleted, { name: company.name }),
            );
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.archive({
                id,
                updatedBy: req.session.userId,
            });

            req.flash(
                "info",
                message(locales.company.archived, { name: company.name }),
            );
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const company = await companiesService.active({
                id,
                updatedBy: req.session.userId,
            });

            req.flash(
                "info",
                message(locales.company.activated, { name: company.name }),
            );
            return res.redirect("/companies");
        } catch (err) {
            next(err);
        }
    },
};
