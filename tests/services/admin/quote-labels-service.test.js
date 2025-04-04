const sql = require("../../../db/sql");
const quoteLabelsService = require("../../../services/admin/quote-labels-service");

jest.mock("../../../db/sql");

describe("Quote labels service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("pluck", () => {
    it("should return specific columns from quote labels", async () => {
      const columns = ["id", "name"];
      const mockResult = [{ id: 1, name: "Name" }];

      sql.mockResolvedValue(mockResult);

      const result = await quoteLabelsService.pluck(columns);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0]).toEqual(expect.arrayContaining(columns));

      expect(result).toEqual(mockResult);
    });
  });
});
