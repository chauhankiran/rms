const pug = require("pug");

describe("Render company sources new template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile("./views/admin/company-sources/new.pug");
  });

  it("should renders the title correctly", () => {
    const html = compiledTemplate({
      title: "New company source",
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>New company source</h1>");
  });
});
