const sql = require("../../../db/sql");
const ticketTypesService = require("../../../services/admin/ticket-types-service");

jest.mock("../../../db/sql");

describe("Ticket types service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Find one", () => {
    it("should return a single ticket type by id", async () => {
      const id = 1;
      const mockType = {
        id: 1,
        name: "Test type",
        isActive: true,
      };

      sql.mockResolvedValue([mockType]);

      const result = await ticketTypesService.findOne(id);
      expect(result).toEqual(mockType);
    });
  });
});
