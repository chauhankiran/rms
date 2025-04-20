const express = require("express");
const companiesController = require("../controllers/companies-controller");
const companyCommentsController = require("../controllers/company-comments-controller");
const companyFilesController = require("../controllers/company-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", companiesController.index);
router.get("/view", companiesController.showView); // change view
router.put("/view", companiesController.view); // change view
router.get("/new", companiesController.new);
router.post("/", companiesController.create);
router.get("/:id", companiesController.show);
router.get("/:id/edit", companiesController.edit);
router.put("/:id", companiesController.update);
router.delete("/:id", companiesController.destroy);
router.put("/:id/archive", companiesController.archive);
router.put("/:id/active", companiesController.active);

router.post("/:id/comments", companyCommentsController.create);
router.delete("/:companyId/comments/:id", companyCommentsController.destroy);

router.post(
    "/:id/files",
    upload.single("displayName"),
    companyFilesController.create
);
router.delete("/:companyId/files/:id", companyFilesController.destroy);
router.get("/:companyId/files/:id", companyFilesController.download);

module.exports = router;
