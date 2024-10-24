const sql = require("../../../db/sql");
const companyLabelsService = require("../../../services/admin/company-labels-service");

jest.mock("../../../db/sql");

describe("Company labels service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("pluck", () => {
    it("should return specific columns from company labels", async () => {
      const columns = ["id", "name"];
      const mockResult = [{ id: 1, name: "Name" }];

      sql.mockResolvedValue(mockResult);

      const result = await companyLabelsService.pluck(columns);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0]).toEqual(expect.arrayContaining(columns));

      expect(result).toEqual(mockResult);
    });
  });
});
