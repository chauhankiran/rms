const notFound = require("../errors/not-found");
const tasksService = require("../services/tasks-service");
const taskCommentsService = require("../services/task-comments-service");
const taskViewsService = require("../services/task-views-service");
const taskTypesService = require("../services/admin/task-types-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");

const columnsObj = {
    id: "t.id",
    name: "t.name",
    taskTypeId: 'tt.name AS "taskType"',
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
            const taskViews = await taskViewsService.pluck(["name"]);

            let columns = 't."isActive",';
            let headers = [];
            for (const taskView of taskViews) {
                const column = columnsObj[taskView.name];
                if (column) {
                    columns += `${column},`;
                    headers.push(taskView.name);
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
            const tasks = await tasksService.find(optionsObj);
            const { count } = await tasksService.count(optionsObj);

            const pages = Math.ceil(count / limit);

            const paginationLinks = generatePaginationLinks({
                link: "/tasks",
                page,
                pages,
                search,
                limit,
                orderBy,
                orderDir,
            });

            return res.render("tasks/index", {
                title: capitalize(req.session.labels.module.task),
                tasks,
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
        const quoteId = req.query.quoteId;
        const ticketId = req.query.ticketId;

        try {
            const taskTypes = await taskTypesService.pluck(["id", "name"]);

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
            req.flash("error", "Name is required.");
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
            await tasksService.create(taskObj);

            req.flash("info", "Task is created.");

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

            return res.render("tasks/show", {
                title:
                    "Show " +
                    pluralize.singular(
                        req.session.labels.module.task.toLowerCase()
                    ),
                task,
                comments,
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

            const taskTypes = await taskTypesService.pluck(["id", "name"]);

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
            return next(notFound());
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
            await tasksService.update(taskObj);

            req.flash("info", "Task is updated.");
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

            await tasksService.destroy(id);

            req.flash("info", "Task is deleted.");
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
            await tasksService.archive(taskObj);

            req.flash("info", "Task is archived.");
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
            await tasksService.active(taskObj);

            req.flash("info", "Task is activated.");
            return res.redirect(`/tasks/${id}`);
        } catch (err) {
            next(err);
        }
    },
};
