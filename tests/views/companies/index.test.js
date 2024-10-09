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
      pagination: {},
      info: [],
      error: [],
      companyFields: {
        id: "Id",
      },
      headers: ["id"],
    });

    expect(html).toContain("<h1>Companies (5)</h1>");
  });
});
