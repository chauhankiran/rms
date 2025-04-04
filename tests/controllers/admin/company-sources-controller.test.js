const companySourcesService = require("../../../services/admin/company-sources-service");
const controller = require("../../../controllers/admin/company-sources-controller");

jest.mock("../../../services/admin/company-sources-service");

describe("Company sources controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
      session: { currentUser: { id: 1 } },
      flash: jest.fn(),
    };

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      redirect: jest.fn(),
    };

    next = jest.fn();
  });

  describe("index", () => {
    it("should render the company sources index page with pagination", async () => {
      req.query.search = "test";
      req.query.page = 1;
      req.query.limit = 10;

      const mockCompanySources = [{ id: 1, name: "Source A" }];
      companySourcesService.find.mockResolvedValue(mockCompanySources);
      companySourcesService.count.mockResolvedValue({ count: 1 });

      await controller.index(req, res, next);

      expect(res.render).toHaveBeenCalledWith("admin/company-sources/index", {
        title: "Company sources",
        companySources: mockCompanySources,
        paginationLinks: expect.any(Object),
        search: "test",
        count: 1,
        orderBy: "id",
        orderDir: "DESC",
      });
    });

    it("should handle errors", async () => {
      companySourcesService.find.mockRejectedValue(new Error("Test error"));

      await controller.index(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("create", () => {
    it("should redirect to new if name is not provided", async () => {
      await controller.create(req, res, next);

      expect(req.flash).toHaveBeenCalledWith("error", "Name is required.");
      expect(res.redirect).toHaveBeenCalledWith("/admin/company-sources/new");
    });

    it("should create a company source and redirect", async () => {
      req.body.name = "New Source";
      companySourcesService.create.mockResolvedValue(true);

      await controller.create(req, res, next);

      expect(req.flash).toHaveBeenCalledWith(
        "info",
        "Company source is created.",
      );
      expect(res.redirect).toHaveBeenCalledWith("/admin/company-sources");
    });

    it("should handle errors", async () => {
      req.body.name = "New Source";
      companySourcesService.create.mockRejectedValue(new Error("Test error"));

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
