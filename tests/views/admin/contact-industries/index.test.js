const pug = require("pug");

describe("Render contact industry index template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile(
      "./views/admin/contact-industries/index.pug",
    );
  });

  it("should renders the title and count correctly", () => {
    const html = compiledTemplate({
      title: "Contact industries",
      count: 6,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      contactIndustries: [],
      paginationLinks: {},
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>Contact industries (6)</h1>");
  });
});
