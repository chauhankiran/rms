const sql = require("../../../db/sql");
const taskLabelsService = require("../../../services/admin/task-labels-service");

jest.mock("../../../db/sql");

describe("Task labels service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("pluck", () => {
    it("should return specific columns from task labels", async () => {
      const columns = ["id", "name"];
      const mockResult = [{ id: 1, name: "Name" }];

      sql.mockResolvedValue(mockResult);

      const result = await taskLabelsService.pluck(columns);

      expect(sql).toHaveBeenCalled();
      expect(sql.mock.calls[0][0]).toEqual(expect.arrayContaining(columns));

      expect(result).toEqual(mockResult);
    });
  });
});
