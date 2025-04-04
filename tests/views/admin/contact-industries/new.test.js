const pug = require("pug");

describe("Render contact industry new template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile(
      "./views/admin/contact-industries/new.pug",
    );
  });

  it("should renders the title correctly", () => {
    const html = compiledTemplate({
      title: "New contact industry",
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>New contact industry</h1>");
  });
});
