const pug = require("pug");

describe("Render contact industry show template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile(
      "./views/admin/contact-industries/show.pug",
    );
  });

  it("should renders the title correctly", () => {
    const contactIndustry = {
      id: 1,
      name: "Industry A",
      isActive: true,
      createdByEmail: "creator@example.com",
      updatedByEmail: "updater@example.com",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
    };

    const html = compiledTemplate({
      title: "Show contact industry",
      contactIndustry,
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>Show contact industry</h1>");
  });
});
