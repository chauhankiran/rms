const dealsService = require("../services/deals-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const sql = require("../db/sql");
const dealSourcesService = require("../services/admin/deal-sources-service");

const handleDeal = async (id, req, res) => {
  const deal = await dealsService.findOne(id);

  if (!deal) {
    req.flash("error", "Deal not found.");
    res.redirect("/deals");
    return;
  }

  return deal;
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
      const dealViews = await sql`
        SELECT
          name
        FROM
          "dealViews"
      `;

      let columns = 'c."isActive",';
      let headers = [];
      for (const dealView of dealViews) {
        // id
        if (dealView.name === "id") {
          columns += "c.id,";
          headers.push("id");
        }

        // name
        if (dealView.name === "name") {
          columns += "c.name,";
          headers.push("name");
        }

        // dealSourceId
        if (dealView.name === "dealSourceId") {
          columns += 'cs.name AS "dealSource",';
          headers.push("dealSourceId");
        }

        // updatedBy
        if (dealView.name === "updatedBy") {
          columns += 'updater."email" AS "updatedByEmail",';
          headers.push("updatedBy");
        }

        // updatedAt
        if (dealView.name === "updatedAt") {
          columns += 'c."updatedAt",';
          headers.push("updatedAt");
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      if (columns.length > 0 && columns.slice(-1) === ",") {
        columns = columns.slice(0, -1);
      }

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
      const deal = await handleDeal(id, req, res);

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
      const deal = await handleDeal(id, req, res);

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
      await handleDeal(id, req, res);

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
      await handleDeal(id, req, res);

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
      await handleDeal(id, req, res);

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
      await handleDeal(id, req, res);

      const dealObj = { id, updatedBy: req.session.currentUser.id };
      await dealsService.active(dealObj);

      req.flash("info", "Deal is activated.");
      res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
