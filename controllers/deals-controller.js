const dealsService = require("../services/deals-service");
const dealViewsService = require("../services/deal-views-service");
const dealSourcesService = require("../services/admin/deal-sources-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");

const columnsObj = {
  id: "d.id",
  name: "d.name",
  total: "d.total",
  dealSourceId: 'ds.name AS "dealSource"',
  createdBy: 'creator.email AS "createdByEmail"',
  createdAt: 'd."createdAt"',
  updatedBy: 'updater.email AS "updatedByEmail"',
  updatedAt: 'd."updatedAt"',
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
      const dealViews = await dealViewsService.pluck(["name"]);

      let columns = 'd."isActive",';
      let headers = [];
      for (const dealView of dealViews) {
        const column = columnsObj[dealView.name];
        if (column) {
          columns += `${column},`;
          headers.push(dealView.name);
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      columns = columns.endsWith(",") ? columns.slice(0, -1) : columns;

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const deals = await dealsService.find(optionsObj);
      const { count } = await dealsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/deals",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("deals/index", {
        title: "Deals",
        deals,
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
      const dealSources = await dealSourcesService.pluck(["id", "name"]);

      return res.render("deals/new", {
        title: "New deal",
        dealSources,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { name, total, description, dealSourceId, companyId, contactId } =
      req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/deals/new`);
      return;
    }

    try {
      const dealObj = {
        name,
        total,
        description,
        dealSourceId,
        companyId: companyId || null,
        contactId: contactId || null,
        createdBy: req.session.currentUser.id,
      };
      await dealsService.create(dealObj);

      req.flash("info", "Deal is created.");
      res.redirect("/deals");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      return res.render("deals/show", {
        title: "Show deal",
        deal,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      const dealSources = await dealSourcesService.pluck(["id", "name"]);

      return res.render("deals/edit", {
        title: "Edit deal",
        deal,
        dealSources,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, total, description, dealSourceId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/deals/${id}/edit`);
      return;
    }

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      const dealObj = {
        id,
        name,
        total,
        description,
        dealSourceId,
        updatedBy: req.session.currentUser.id,
      };
      await dealsService.update(dealObj);

      req.flash("info", "Deal is updated.");
      res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      await dealsService.destroy(id);

      req.flash("info", "Deal is deleted.");
      res.redirect("/deals");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      const dealObj = { id, updatedBy: req.session.currentUser.id };
      await dealsService.archive(dealObj);

      req.flash("info", "Deal is archived.");
      res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        res.redirect("/deals");
        return;
      }

      const dealObj = { id, updatedBy: req.session.currentUser.id };
      await dealsService.active(dealObj);

      req.flash("info", "Deal is activated.");
      res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
