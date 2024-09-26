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
  create: async (req, res, next) => {},
  show: async (req, res, next) => {
    res.render("admin/companySources/show", { title: "Show company sources" });
  },
  edit: async (req, res, next) => {
    res.render("admin/companySources/edit", { title: "Edit company sources" });
  },
  update: async (req, res, next) => {},
  destroy: async (req, res, next) => {},
};
