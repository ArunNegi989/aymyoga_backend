const express = require("express");
const router = express.Router();
const controller = require("../controllers/coursecontrollers/prenatalPageController");
const upload = require("../middleware/upload");

/* =========================
   MULTER CONFIG
========================= */
const cpUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "locationImage", maxCount: 1 },
  { name: "heroGridImage0", maxCount: 1 },
  { name: "heroGridImage1", maxCount: 1 },
  { name: "heroGridImage2", maxCount: 1 },
]);

/* =========================
   ROUTES
========================= */

/* CREATE */
router.post("/", cpUpload, controller.createPage);

/* UPDATE */
router.put("/", cpUpload, controller.updatePage);

/* GET */
router.get("/", controller.getPage);

/* DELETE */
router.delete("/", controller.deletePage);

module.exports = router;