const notFound = require("../errors/not-found");
const tasksService = require("../services/tasks-service");
const taskCommentsService = require("../services/task-comments-service");
const taskFilesService = require("../services/task-files-service");
const taskViewsService = require("../services/task-views-service");
const refsService = require("../services/admin/refs-service");
const labelsService = require("../services/admin/labels-service");
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
    phone: {
        as: "t.phone",
        alias: "phone",
    },
    location: {
        as: "t.location",
        alias: "location",
    },
    taskTypeId: {
        as: 'tt.name AS "taskType"',
        alias: "taskType",
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
            let fields = await taskViewsService.find(
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

            // Fetch tasks.
            const optionsObj = {
                search,
                limit,
                skip,
                orderBy,
                orderDir,
                query,
                isActiveOnly,
            };
            const tasks = await tasksService.find(optionsObj);
            const { count } = await tasksService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            // Generate pagination links for buttons.
            const paginationLinks = generatePaginationLinks({
                link: "/tasks",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            // Render.
            return res.render("tasks/index", {
                title: capitalize(req.session.labels.module.task),
                tasks,
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
        const quoteId = req.query.quoteId;
        const ticketId = req.query.ticketId;

        try {
            const taskTypes = await refsService.pluck("taskTypes", [
                "id",
                "name",
            ]);

            return res.render("tasks/new", {
                title:
                    "New " +
                    pluralize.singular(
                        req.session.labels.module.task.toLowerCase()
                    ),
                taskTypes,
                companyId,
                contactId,
                dealId,
                quoteId,
                ticketId,
            });
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        const {
            name,
            phone,
            location,
            description,
            taskTypeId,
            companyId,
            contactId,
            dealId,
            quoteId,
            ticketId,
        } = req.body;

        if (!name) {
            req.flash("error", locales.task.nameRequired);
            return res.redirect(`/tasks/new`);
        }
        try {
            const taskObj = {
                name,
                phone,
                location,
                description,
                taskTypeId,
                companyId: companyId || null,
                contactId: contactId || null,
                dealId: dealId || null,
                quoteId: quoteId || null,
                ticketId: ticketId || null,
                createdBy: req.session.currentUser.id,
            };

            const resp = await tasksService.create(taskObj);
            req.flash(
                "info",
                message(locales.task.created, { name: resp.name })
            );

            if (companyId) {
                return res.redirect(`/companies/${companyId}`);
            } else if (contactId) {
                return res.redirect(`/contacts/${contactId}`);
            } else if (dealId) {
                return res.redirect(`/deals/${dealId}`);
            } else if (quoteId) {
                return res.redirect(`/quotes/${quoteId}`);
            } else if (ticketId) {
                return res.redirect(`/tickets/${ticketId}`);
            } else {
                return res.redirect("/tasks");
            }
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        const id = req.params.id;

        try {
            const task = await tasksService.findOne(id);

            if (!task) {
                return next(notFound());
            }

            // Get all comments.
            const comments = await taskCommentsService.findOne(id);

            // Get all files.
            const files = await taskFilesService.findOne(id);

            return res.render("tasks/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.task.toLowerCase()
                    ),
                task,
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
            const task = await tasksService.findOne(id);

            if (!task) {
                return next(notFound());
            }

            const taskTypes = await refsService.pluck("taskTypes", [
                "id",
                "name",
            ]);

            return res.render("tasks/edit", {
                title:
                    "Edit " +
                    pluralize.singular(
                        req.session.labels.module.task.toLowerCase()
                    ),
                task,
                taskTypes,
            });
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        const id = req.params.id;
        const { name, phone, location, description, taskTypeId } = req.body;

        if (!name) {
            req.flash("error", locales.task.nameRequired);
            return res.redirect(`/tasks/${id}/edit`);
        }
        try {
            const task = await tasksService.findOne(id);

            if (!task) {
                req.flash("error", "Task not found.");
                return res.redirect("/tasks");
            }

            const taskObj = {
                id,
                name,
                phone,
                location,
                description,
                taskTypeId,
                updatedBy: req.session.currentUser.id,
            };
            const resp = await tasksService.update(taskObj);

            req.flash(
                "info",
                message(locales.task.updated, { name: resp.name })
            );
            return res.redirect(`/tasks/${id}`);
        } catch (err) {
            next(err);
        }
    },

    destroy: async (req, res, next) => {
        const id = req.params.id;

        try {
            const task = await tasksService.findOne(id);

            if (!task) {
                return next(notFound());
            }

            const resp = await tasksService.destroy(id);

            req.flash(
                "info",
                message(locales.task.deleted, { name: resp.name })
            );
            return res.redirect("/tasks");
        } catch (err) {
            next(err);
        }
    },

    archive: async (req, res, next) => {
        const id = req.params.id;

        try {
            const task = await tasksService.findOne(id);

            if (!task) {
                return next(notFound());
            }

            const taskObj = { id, updatedBy: req.session.currentUser.id };
            const resp = await tasksService.archive(taskObj);

            req.flash(
                "info",
                message(locales.task.archived, { name: resp.name })
            );
            return res.redirect(`/tasks/${id}`);
        } catch (err) {
            next(err);
        }
    },

    active: async (req, res, next) => {
        const id = req.params.id;

        try {
            const task = await tasksService.findOne(id);

            if (!task) {
                return next(notFound());
            }

            const taskObj = { id, updatedBy: req.session.currentUser.id };
            const resp = await tasksService.active(taskObj);

            req.flash(
                "info",
                message(locales.task.activated, { name: resp.name })
            );
            return res.redirect(`/tasks/${id}`);
        } catch (err) {
            next(err);
        }
    },

    showView: async (req, res, next) => {
        // Get all active fields.
        const allFields = await labelsService.pluck("taskLabels", ["name"]);
        const all = allFields.map((field) => field.name);

        // Get selected fields.
        const selectedFields = await taskViewsService.find(
            req.session.currentUser.id
        );
        const selected = selectedFields.map((field) => field.name);

        // Get available fields (all - selected).
        const availableFields = all.filter((item) => !selected.includes(item));

        return res.render("tasks/view", {
            title: "Change view for tasks",
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
            await taskViewsService.destroy(req.session.currentUser.id);

            // 2. Insert selected fields.
            for (const [index, field] of fields.entries()) {
                await taskViewsService.create({
                    userId: req.session.currentUser.id,
                    field,
                    seq: index + 1,
                });
            }

            req.flash("info", locales.view.updatedTasks);
            res.redirect("/tasks");
            return;
        } catch (err) {
            next(err);
        }
    },
};
