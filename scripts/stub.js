/**
 * This file is used to generate stub code.
 * Usage:
 *   npm run pluralName singularName
 *
 *   e.g.
 *   npm run deals deal
 */
const fs = require("fs");
const path = require("path");

const entity = process.argv[2];
const entitySingular = process.argv[3];

if (!entity) {
  console.error("Entity name is required");
  process.exit();
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const routesDir = path.join(process.cwd(), "routes");
const controllersDir = path.join(process.cwd(), "controllers");
const servicesDir = path.join(process.cwd(), "services");
const viewsDir = path.join(process.cwd(), "views");

// Stub route.
fs.writeFileSync(
  path.join(routesDir, `${entity}.js`),
  `const express = require("express");
const ${entity}Controller = require("../controllers/${entity}-controller");

const router = express.Router();

router.get("/", ${entity}Controller.index);
router.get("/new", ${entity}Controller.new);
router.post("/", ${entity}Controller.create);
router.get("/:id", ${entity}Controller.show);
router.get("/:id/edit", ${entity}Controller.edit);
router.put("/:id", ${entity}Controller.update);
router.delete("/:id", ${entity}Controller.destroy);
router.put("/:id/archive", ${entity}Controller.archive);
router.put("/:id/active", ${entity}Controller.active);

module.exports = router;
`,
);
console.log(`Route file ${entity}.js created.`);

// Stub controller.
fs.writeFileSync(
  path.join(controllersDir, `${entity}-controller.js`),
  `const ${entity}Service = require("../services/${entity}-service");

module.exports = {
  index: async (req, res, next) => {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "DESC";

    try {
      const optionsObj = { search, limit, skip, orderBy, orderDir };
      const ${entity} = await ${entity}Service.find(optionsObj);
      const { count } = await ${entity}Service.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/${entity}",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("${entity}/index", {
        title: "${capitalize(entity)}",
        ${entity},
        paginationLinks,
        search,
        count,
        orderBy,
        orderDir,
      });
    } catch (err) {
      next(err)
    }
  },

  new: async (req, res, next) => {
    return res.render("${entity}/new", {
      title: "New ${entitySingular}",
    });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect("/${entitySingular}/new");
      return;
    }

    try {
      const ${entitySingular}Obj = { name, createdBy: req.session.currentUser.id };
      await ${entity}Service.create(${entitySingular}Obj);

      req.flash("info", "${entitySingular} is created.");
      res.redirect("/${entitySingular}");
      return;
    } catch (err) {
      next(err)
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }

      return res.render("${entity}/show", {
        title: "Show ${entitySingular}",
        ${entitySingular},
      });
    } catch (err) {
      next(err)
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }

      return res.render("${entity}/edit", {
        title: "Edit ${entitySingular}",
        ${entitySingular},
      });    
    } catch (err) {
      next(err)
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(\`/${entity}/\${id}/edit\`);
      return;
    }

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }

      const ${entitySingular}Obj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      await ${entity}Service.update(${entitySingular}Obj);

      req.flash("info", "Company source is updated.");
      res.redirect(\`/${entity}/\${id}\`);
      return;
    } catch (err) {
      next(err)
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }
      
      await ${entity}Service.destroy(id);

      req.flash("info", "${entitySingular} is deleted.");
      res.redirect("/${entity}");
    } catch (err) {
      next(err)
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }

      const ${entitySingular}Obj = { id, updatedBy: req.session.currentUser.id };
      await ${entity}Service.active(${entitySingular}Obj);

      req.flash("info", "${entitySingular} is activated.");
      res.redirect(\`/${entity}/\${id}\`);
    } catch (err) {
      next(err)
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ${entitySingular} = await ${entity}Service.findOne(id);

      if (!${entitySingular}) {
        req.flash("error", "${entitySingular} not found.");
        res.redirect("/${entity}");
        return;
      }

      const ${entitySingular}Obj = { id, updatedBy: req.session.currentUser.id };
      await ${entity}Service.active(${entitySingular}Obj);

      req.flash("info", "${entitySingular} is activated.");
      res.redirect(\`/${entity}/\${id}\`);
    } catch (err) {
      next(err)
    }
  },
};
`,
);
console.log(`Controller file ${entity}-controller.js created.`);

// Stub service.
fs.writeFileSync(
  path.join(servicesDir, `${entity}-service.js`),
  `const sql = require("../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql\` WHERE name iLIKE \${"%" + search + "%"}\`
      : sql\`\`;
  },

  count: async (optionsObj) => {
    const { search } = optionsObj;

    const whereClause = search
      ? sql\` WHERE name iLIKE \${"%" + search + "%"}\`
      : sql\`\`;

    return await sql\`
      SELECT
        COUNT(id)
      FROM
        ${entity}
      \${whereClause}
    \`.then(([x]) => x);
  },

  create: async (${entitySingular}Obj) => {
    const { name, createdBy } = ${entitySingular}Obj;

    return await sql\`
        INSERT INTO "${entity}" (
          name,
          "createdBy"
        ) VALUES (
          \${name},
          \${createdBy}
        ) returning id
      \`;
  },

  findOne: async (id) => {
  },

  update: async (${entitySingular}Obj) => {
    const { id, name, updatedBy } = ${entitySingular}Obj;

    return await sql\`
      UPDATE
        ${entity}
      SET
        name = \${name},
        "updatedBy" = \${updatedBy},
        "updatedAt" = \${sql\`now()\`}
      WHERE
        id = \${id}
      returning id
    \`.then(([x]) => x);
  },

  destroy: async (id) => {
    return await sql\`
      DELETE FROM
        ${entity}
      WHERE
        id = \${id}
      returning id
    \`.then(([x]) => x);
  },

  archive: async (${entitySingular}Obj) => {
    const { id, updatedBy } = ${entitySingular}Obj;

    return await sql\`
      UPDATE
        ${entity}
      SET
        "isActive" = false,
        "updatedBy" = \${updatedBy},
        "updatedAt" = \${sql\`now()\`}
      WHERE
        id = \${id}
      returning id
    \`.then(([x]) => x);
  },

  active: async (${entitySingular}Obj) => {
    const { id, updatedBy } = ${entitySingular}Obj;

    return await sql\`
      UPDATE
        ${entity}
      SET
        "isActive" = true,
        "updatedBy" = \${updatedBy},
        "updatedAt" = \${sql\`now()\`}
      WHERE
        id = \${id}
      returning id
    \`.then(([x]) => x);
  },

};
`,
);
console.log(`Service file ${entity}-controller.js created.`);

// Stub view.
fs.mkdirSync(path.join(viewsDir, entity));
console.log(`Views folder ${entity} created.`);

fs.writeFileSync(
  path.join(viewsDir, entity, "index.pug"),
  `extends ../layout
block content
  .row
    .col-12
      h1= title
`,
);
console.log(`View file ${entity}/index.pug created.`);

fs.writeFileSync(
  path.join(viewsDir, entity, "new.pug"),
  `extends ../layout
block content
  .row
    .col-12
      h1= title
`,
);
console.log(`View file ${entity}/new.pug created.`);

fs.writeFileSync(
  path.join(viewsDir, entity, "edit.pug"),
  `extends ../layout
block content
  .row
    .col-12
      h1= title
`,
);
console.log(`View file ${entity}/edit.pug created.`);

fs.writeFileSync(
  path.join(viewsDir, entity, "show.pug"),
  `extends ../layout
block content
  .row
    .col-12
      h1= title
`,
);
console.log(`View file ${entity}/show.pug created.`);
