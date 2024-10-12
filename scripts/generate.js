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
    try {
      return res.render("${entity}/index", {
        title: "${capitalize(entity)}",
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
    try {
    } catch (err) {
      next(err)
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      return res.render("${entity}/show", {
        title: "Show ${entitySingular}",
      });
    } catch (err) {
      next(err)
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      return res.render("${entity}/edit", {
        title: "Edit ${entitySingular}",
      });    
    } catch (err) {
      next(err)
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;

    try {
    
    } catch (err) {
      next(err)
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
    
    } catch (err) {
      next(err)
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
    
    } catch (err) {
      next(err)
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
    
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
  },

  count: async (optionsObj) => {
  },

  create: async (${entitySingular}Obj) => {
  },

  findOne: async (id) => {
  },

  update: async (${entitySingular}Obj) => {
  },

  destroy: async (id) => {
  },

  archive: async (${entitySingular}Obj) => {
  },

  active: async (${entitySingular}Obj) => {
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
