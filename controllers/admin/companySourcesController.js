const companySourceService = require("../../services/admin/companySourceService");

module.exports = {
  index: async (req, res, next) => {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "DESC";

    try {
      const optionsObj = { search, limit, skip, orderBy, orderDir };
      const companySources = await companySourceService.find(optionsObj);
      const { count } = await companySourceService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const pagination = {
        first:
          page > 1
            ? search
              ? `/admin/company-sources?search=${search}&page=1&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/admin/company-sources?page=1&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        prev:
          page > 1
            ? search
              ? `/admin/company-sources?search=${search}&page=${
                  page - 1
                }&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/admin/company-sources?page=${page - 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        next:
          page < pages
            ? search
              ? `/admin/company-sources?search=${search}&page=${
                  page + 1
                }&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/admin/company-sources?page=${page + 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        last:
          page < pages
            ? search
              ? `/admin/company-sources?search=${search}&page=${pages}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/admin/company-sources?page=${pages}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,
      };

      return res.render("admin/companySources/index", {
        title: "Company sources",
        companySources,
        pagination,
        search,
        count,
        orderBy,
        orderDir,
      });
    } catch (err) {
      next(err);
    }
  },

  new: async (req, res, next) => {
    res.render("admin/companySources/new", { title: "New company sources" });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect("/admin/company-sources/new");
      return;
    }

    try {
      const companySourceObj = { name, createdBy: req.session.currentUser.id };
      const companySource = await companySourceService.create(companySourceObj);

      if (!companySource) {
        req.flash("error", "Problem while creating a company source.");
        res.redirect("/admin/company-sources/new");
        return;
      }

      req.flash("info", "Company source is created.");
      res.redirect("/admin/company-sources");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourceService.findOne(id);

      res.render("admin/companySources/show", {
        title: companySource.name,
        companySource,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourceService.findOne(id);

      res.render("admin/companySources/edit", {
        title: "Edit company source",
        companySource,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/admin/company-sources/${id}/edit`);
      return;
    }

    try {
      const companySourceObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      const companySource = await companySourceService.update(companySourceObj);

      if (!companySource) {
        req.flash("error", "Problem while updating user.");
        res.redirect(`/admin/company-sources/${id}`);
        return;
      }

      req.flash("info", "Company source is updated.");
      res.redirect(`/admin/company-sources/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourceService.destroy(id);

      if (!companySource) {
        req.flash("error", "Problem while deleting company source.");
        res.redirect(`/admin/company-sources/${id}`);
        return;
      }

      req.flash("info", "Company sources is deleted.");
      res.redirect("/admin/company-sources");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourceService.findOne(id);

      if (!companySource) {
        req.flash("error", "Company source not found.");
        res.redirect(`/admin/company-sources`);
        return;
      }

      const companySourceObj = {
        id,
        newCompanySourceStatus: !companySource.isActive,
      };
      await companySourceService.archive(companySourceObj);

      req.flash("info", "Company source status is updated.");
      res.redirect(`/admin/company-sources/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },
};
