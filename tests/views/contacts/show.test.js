const pug = require("pug");

describe("Render contact show template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/contacts/show.pug");
  });

  it("should renders the title correctly", () => {
    const contact = {
      id: 1,
      firstName: "Kai",
      lastName: "Doe",
      isActive: true,
      createdByEmail: "creator@example.com",
      updatedByEmail: "updater@example.com",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
    };

    const html = compiledTemplate({
      title: "Show contact",
      contact,
      info: [],
      error: [],
      labels: {
        contact: {},
      },
    });

    expect(html).toContain("<h1>Show contact</h1>");
  });
});
