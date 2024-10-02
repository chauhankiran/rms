const sql = require("../../../db/sql");
const companySourcesService = require("../../../services/admin/company-sources-service");

jest.mock("../../../db/sql");

describe("Company sources service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Find", () => {
    it("should return company sources with search filter", async () => {
      const optionsObj = {
        skip: 0,
        limit: 10,
        search: "test",
        orderBy: "name",
        orderDir: "ASC",
      };

      const mockResults = [
        {
          id: 1,
          name: "Test Company",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
          isActive: true,
        },
      ];

      sql.mockResolvedValue(mockResults);

      const result = await companySourcesService.find(optionsObj);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0][0]).toEqual(
        expect.stringContaining("WHERE name iLIKE"),
      );

      expect(result).toEqual(mockResults);
    });

    it("should return company sources without search filter", async () => {
      const optionsObj = {
        skip: 0,
        limit: 10,
        search: null,
        orderBy: "name",
        orderDir: "ASC",
      };

      const mockResults = [
        {
          id: 1,
          name: "Test Company",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
          isActive: true,
        },
      ];

      sql.mockResolvedValue(mockResults);

      const result = await companySourcesService.find(optionsObj);

      expect(sql).toHaveBeenCalledWith(expect.not.stringContaining("WHERE"));
      expect(result).toEqual(mockResults);
    });
  });

  describe("count", () => {
    it("should return the count of company sources with search filter", async () => {
      const optionsObj = { search: "test" };
      sql.mockResolvedValue([{ count: 1 }]);

      const result = await companySourcesService.count(optionsObj);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0][0]).toEqual(
        expect.stringContaining("WHERE name iLIKE"),
      );

      expect(result).toEqual({ count: 1 });
    });

    it("should return the count of company sources without search filter", async () => {
      const optionsObj = { search: null };
      sql.mockResolvedValue([{ count: 0 }]);

      const result = await companySourcesService.count(optionsObj);

      expect(sql).toHaveBeenCalledWith(expect.not.stringContaining("WHERE"));
      expect(result).toEqual({ count: 0 });
    });
  });

  describe("create", () => {
    it("should create a company source and return its id", async () => {
      const companySourceObj = { name: "New Source", createdBy: 1 };
      sql.mockResolvedValue([{ id: 1 }]);

      const result = await companySourcesService.create(companySourceObj);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0][0]).toEqual(
        expect.stringContaining("INSERT INTO"),
      );

      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe("findOne", () => {
    it("should return a single company source by id", async () => {
      const id = 1;
      sql.mockResolvedValue([{ id: 1, name: "Test Source", isActive: true }]);

      const result = await companySourcesService.findOne(id);
      expect(result).toEqual({ id: 1, name: "Test Source", isActive: true });
    });
  });

  describe("update", () => {
    it("should update a company source", async () => {
      const userObj = { id: 1, name: "Updated Company", updatedBy: 2 };
      sql.mockResolvedValue([{ id: 1 }]);

      const result = await companySourcesService.update(userObj);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe("destroy", () => {
    it("should delete a company source by id", async () => {
      const id = 1;
      sql.mockResolvedValue([{ id: 1 }]);

      const result = await companySourcesService.destroy(id);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe("archive", () => {
    it("should archive a company source", async () => {
      const companySourceObj = { id: 1, newCompanySourceStatus: false };
      sql.mockResolvedValue([{ id: 1 }]);

      const result = await companySourcesService.archive(companySourceObj);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe("pluck", () => {
    it("should return specific columns from company sources", async () => {
      const columns = ["id", "name"];
      sql.mockResolvedValue([{ id: 1, name: "Test Source" }]);

      const result = await companySourcesService.pluck(columns);
      expect(result).toEqual([{ id: 1, name: "Test Source" }]);
    });
  });
});
