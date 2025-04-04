const pug = require("pug");

describe("Render contact edit template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/contacts/edit.pug");
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

    const contactIndustries = [
      {
        id: 1,
        name: "Industry A",
        isActive: true,
        createdByEmail: "creator@example.com",
        updatedByEmail: "updater@example.com",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-02",
      },
    ];

    const html = compiledTemplate({
      title: "Edit contact",
      contact,
      contactIndustries,
      info: [],
      error: [],
      labels: {
        contact: {},
      },
    });

    expect(html).toContain("<h1>Edit contact</h1>");
  });
});
