const pug = require("pug");

describe("Render company edit template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/companies/edit.pug");
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
    const companySources = [
      {
        id: 1,
        name: "Source A",
        isActive: true,
        createdByEmail: "creator@example.com",
        updatedByEmail: "updater@example.com",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-02",
      },
    ];

    const html = compiledTemplate({
      title: "Edit company",
      company,
      companySources,
      info: [],
      error: [],
      labels: {
        company: {},
      },
    });

    expect(html).toContain("<h1>Edit company</h1>");
  });
});
