const pug = require("pug");

describe("Render contact new template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/contacts/new.pug");
  });

  it("should renders the title correctly", () => {
    const html = compiledTemplate({
      title: "New contact",
      info: [],
      error: [],
      contactIndustries: [
        {
          id: 1,
          name: "Industry A",
          isActive: true,
          createdByEmail: "creator@example.com",
          updatedByEmail: "updater@example.com",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      ],
      labels: {
        contact: {},
      },
    });

    expect(html).toContain("<h1>New contact</h1>");
  });
});
