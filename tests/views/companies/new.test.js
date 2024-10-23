const pug = require("pug");

describe("Render company new template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/companies/new.pug");
  });

  it("should renders the title correctly", () => {
    const html = compiledTemplate({
      title: "New company",
      info: [],
      error: [],
      companySources: [
        {
          id: 1,
          name: "Source A",
          isActive: true,
          createdByEmail: "creator@example.com",
          updatedByEmail: "updater@example.com",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      ],
      labels: {
        company: {},
      },
    });

    expect(html).toContain("<h1>New company</h1>");
  });
});
