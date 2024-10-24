const tasksService = require("../services/tasks-service");
const taskTypesService = require("../services/admin/task-types-service");
const taskViewsService = require("../services/task-views-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");

const handleTask = async (id, req, res) => {
  const task = await tasksService.findOne(id);

  if (!task) {
    req.flash("error", "Task not found.");
    res.redirect("/tasks");
    return;
  }

  return task;
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
        // id
        if (taskView.name === "id") {
          columns += "t.id,";
          headers.push("id");
        }

        // name
        if (taskView.name === "name") {
          columns += "t.name,";
          headers.push("name");
        }

        // taskTypeId
        if (taskView.name === "taskTypeId") {
          columns += "t.taskTypeId,";
          headers.push("taskTypeId");
        }

        // updatedBy
        if (taskView.name === "updatedBy") {
          columns += 'updater."email" AS "updatedByEmail",';
          headers.push("updatedBy");
        }

        // updatedAt
        if (taskView.name === "updatedAt") {
          columns += 't."updatedAt",';
          headers.push("updatedAt");
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      if (columns.length > 0 && columns.slice(-1) === ",") {
        columns = columns.slice(0, -1);
      }

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
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
        title: "Tasks",
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
    try {
      const taskTypes = await taskTypesService.pluck(["id", "name"]);

      return res.render("tasks/new", {
        title: "New task",
        taskTypes,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const {
      name,
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
      res.redirect(`/tasks/new`);
      return;
    }

    try {
      const taskObj = {
        name,
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
      res.redirect("/tasks");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const task = await handleTask(id, req, res);

      return res.render("tasks/show", {
        title: "Show task",
        task,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const task = await handleTask(id, req, res);

      const taskTypes = await taskTypesService.pluck(["id", "name"]);

      return res.render("tasks/edit", {
        title: "Edit task",
        task,
        taskTypes,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, description, taskTypeId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/tasks/${id}/edit`);
      return;
    }

    try {
      await handleTask(id, req, res);

      const taskObj = {
        id,
        name,
        description,
        taskTypeId,
        updatedBy: req.session.currentUser.id,
      };
      await tasksService.update(taskObj);

      req.flash("info", "Task is updated.");
      res.redirect(`/tasks/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTask(id, req, res);

      await tasksService.destroy(id);

      req.flash("info", "Task is deleted.");
      res.redirect("/tasks");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTask(id, req, res);

      const taskObj = { id, updatedBy: req.session.currentUser.id };
      await tasksService.archive(taskObj);

      req.flash("info", "Task is archived.");
      res.redirect(`/tasks/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTask(id, req, res);

      const taskObj = { id, updatedBy: req.session.currentUser.id };
      await tasksService.active(taskObj);

      req.flash("info", "Task is activated.");
      res.redirect(`/tasks/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
