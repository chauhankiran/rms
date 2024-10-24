const sql = require("../../../db/sql");
const dealSourcesService = require("../../../services/admin/deal-sources-service");

jest.mock("../../../db/sql");

describe("Deal sources service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Find one", () => {
    it("should return a single deal source by id", async () => {
      const id = 1;
      const mockSource = {
        id: 1,
        name: "Test source",
        isActive: true,
      };

      sql.mockResolvedValue([mockSource]);

      const result = await dealSourcesService.findOne(id);
      expect(result).toEqual(mockSource);
    });
  });
});
