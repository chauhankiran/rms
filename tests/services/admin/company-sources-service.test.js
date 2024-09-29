const sql = require("../../../sql");
const companySourcesService = require("../../../services/admin/company-sources-service");

jest.mock("../../../sql");

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
        expect.stringContaining("WHERE name iLIKE")
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
        expect.stringContaining("WHERE name iLIKE")
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
});
