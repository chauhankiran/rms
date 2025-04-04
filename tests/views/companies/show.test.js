const pug = require("pug");

describe("Render company show template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/companies/show.pug");
  });

  it("should renders the title correctly", () => {
    const company = {
      id: 1,
      name: "Example, Inc.",
      isActive: true,
      createdByEmail: "creator@example.com",
      updatedByEmail: "updater@example.com",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
    };

    const html = compiledTemplate({
      title: "Show company",
      company,
      contacts: [],
      deals: [],
      quotes: [],
      tickets: [],
      tasks: [],
      info: [],
      error: [],
      labels: {
        company: {},
      },
    });

    expect(html).toContain("<h1>Show company</h1>");
  });
});
