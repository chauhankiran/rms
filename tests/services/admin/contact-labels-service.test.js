const sql = require("../../../db/sql");
const contactLabelsService = require("../../../services/admin/contact-labels-service");

jest.mock("../../../db/sql");

describe("Contact labels service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("pluck", () => {
    it("should return specific columns from contact labels", async () => {
      const columns = ["id", "name"];
      const mockResult = [{ id: 1, name: "Name" }];

      sql.mockResolvedValue(mockResult);

      const result = await contactLabelsService.pluck(columns);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0]).toEqual(expect.arrayContaining(columns));

      expect(result).toEqual(mockResult);
    });
  });
});
