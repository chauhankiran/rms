const pug = require("pug");

describe("Render contact index template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/contacts/index.pug");
  });

  it("should renders the title and count correctly", () => {
    const html = compiledTemplate({
      title: "Contacts",
      count: 5,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      contacts: [],
      paginationLinks: {},
      info: [],
      error: [],
      labels: {
        contact: {},
      },
      headers: [],
    });

    expect(html).toContain("<h1>Contacts (5)</h1>");
  });
});
