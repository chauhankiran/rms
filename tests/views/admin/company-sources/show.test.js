const pug = require("pug");

describe("Render company sources show template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile(
      "./views/admin/company-sources/show.pug",
    );
  });

  it("should renders the title correctly", () => {
    const companySource = {
      id: 1,
      name: "Source A",
      isActive: true,
      createdByEmail: "creator@example.com",
      updatedByEmail: "updater@example.com",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
    };

    const html = compiledTemplate({
      title: "Show company source",
      companySource,
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>Show company source</h1>");
  });
});
