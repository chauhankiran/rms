const pug = require("pug");

describe("Render company index template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/companies/index.pug");
  });

  it("should renders the title and count correctly", () => {
    const html = compiledTemplate({
      title: "Companies",
      count: 5,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      companies: [],
      paginationLinks: {},
      info: [],
      error: [],
      labels: {
        company: {},
      },
      headers: ["id"],
    });

    expect(html).toContain("<h1>Companies (5)</h1>");
  });
});
