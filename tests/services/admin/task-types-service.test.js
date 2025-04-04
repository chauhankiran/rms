const sql = require("../../../db/sql");
const taskTypesService = require("../../../services/admin/task-types-service");

jest.mock("../../../db/sql");

describe("Task types service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Find one", () => {
    it("should return a single task type by id", async () => {
      const id = 1;
      const mockType = {
        id: 1,
        name: "Test type",
        isActive: true,
      };

      sql.mockResolvedValue([mockType]);

      const result = await taskTypesService.findOne(id);
      expect(result).toEqual(mockType);
    });
  });
});
