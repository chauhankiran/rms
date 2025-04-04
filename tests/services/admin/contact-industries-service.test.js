const sql = require("../../../db/sql");
const contactIndustriesService = require("../../../services/admin/contact-industries-service");

jest.mock("../../../db/sql");

describe("Contact industries service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Find one", () => {
    it("should return a single contact industry by id", async () => {
      const id = 1;
      const mockIndustry = {
        id: 1,
        name: "Test industry",
        isActive: true,
      };

      sql.mockResolvedValue([mockIndustry]);

      const result = await contactIndustriesService.findOne(id);
      expect(result).toEqual(mockIndustry);
    });
  });
});
