const pug = require("pug");

describe("Render company source index template", () => {
  let compiledTemplate;

  beforeAll(() => {
    compiledTemplate = pug.compileFile(
      "./views/admin/company-sources/index.pug",
    );
  });

  it("should renders the title and count correctly", () => {
    const html = compiledTemplate({
      title: "Company sources",
      count: 5,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      companySources: [],
      paginationLinks: {},
      info: [],
      error: [],
    });

    expect(html).toContain("<h1>Company sources (5)</h1>");
  });

  it('should renders "No company sources found" when companySources is empty', () => {
    const html = compiledTemplate({
      title: "Company Sources",
      count: 0,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      companySources: [],
      paginationLinks: {},
      info: [],
      error: [],
    });

    expect(html).toContain("No company sources found.");
  });

  it("should renders company sources correctly", () => {
    const companySources = [
      {
        id: 1,
        name: "Source A",
        isActive: true,
        createdByEmail: "creator@example.com",
        updatedByEmail: "updater@example.com",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-02",
      },
      {
        id: 2,
        name: "Source B",
        isActive: false,
        createdByEmail: "",
        updatedByEmail: "",
        createdAt: "2023-01-03",
        updatedAt: "2023-01-04",
      },
    ];

    const html = compiledTemplate({
      title: "Company Sources",
      count: 2,
      orderBy: "name",
      orderDir: "ASC",
      search: "",
      companySources,
      paginationLinks: {},
      info: [],
      error: [],
    });

    expect(html).toContain("Source A");
    expect(html).toContain("Source B");
    expect(html).toContain("(archived)");
  });

  it("should renders pagination buttons correctly", () => {
    const paginationLinks = {
      first: "/admin/company-sources?page=1",
      prev: "/admin/company-sources?page=0",
      next: "/admin/company-sources?page=2",
      last: "/admin/company-sources?page=10",
    };

    const html = compiledTemplate({
      title: "Company Sources",
      count: 0,
      orderBy: "id",
      orderDir: "ASC",
      search: "",
      companySources: [],
      paginationLinks,
      info: [],
      error: [],
    });

    expect(html).toContain("First");
    expect(html).toContain("Prev");
    expect(html).toContain("Next");
    expect(html).toContain("Last");
  });
});
