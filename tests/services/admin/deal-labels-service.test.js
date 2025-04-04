const sql = require("../../../db/sql");
const dealLabelsService = require("../../../services/admin/deal-labels-service");

jest.mock("../../../db/sql");

describe("deal labels service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("pluck", () => {
    it("should return specific columns from deal labels", async () => {
      const columns = ["id", "name"];
      const mockResult = [{ id: 1, name: "Name" }];

      sql.mockResolvedValue(mockResult);

      const result = await dealLabelsService.pluck(columns);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0]).toEqual(expect.arrayContaining(columns));

      expect(result).toEqual(mockResult);
    });
  });
});
