const express = require("express");
const companiesController = require("../controllers/companies-controller");
const companyFilesController = require("../controllers/company-files-controller");
const multer = require("multer");
const upload = multer({ dest: process.env.FILE_UPLOAD_DEST });

const router = express.Router();

// Change view routes. Added these routes at the top
// due to conflicts against /:id route.
router.get("/view", companiesController.showView);
router.put("/view", companiesController.view);

// Companies routes.
router.get("/", companiesController.index);
router.get("/new", companiesController.new);
router.post("/", companiesController.create);
router.get("/:id", companiesController.show);
router.get("/:id/edit", companiesController.edit);
router.put("/:id", companiesController.update);
router.delete("/:id", companiesController.destroy);
router.put("/:id/archive", companiesController.archive);
router.put("/:id/active", companiesController.active);

// Company comment routes.
router.post("/:id/comments", companiesController.createComment);
router.delete("/:companyId/comments/:id", companiesController.destroyComment);

// Company file routes.
router.post(
    "/:id/files",
    upload.single("displayName"),
    companyFilesController.create
);
router.delete("/:companyId/files/:id", companyFilesController.destroy);
router.get("/:companyId/files/:id", companyFilesController.download);

module.exports = router;
