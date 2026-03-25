const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/yoga300Content1controller");
const upload = require("../middleware/upload");

/* =========================
   MULTER
========================= */
const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
]);

/* =========================
   ROUTES
========================= */

// create
router.post("/create", uploadFields, controller.create);

// get all
router.get("/", controller.get);

// get single
router.get("/:id", controller.getSingle);

// update
router.put("/update/:id", uploadFields, controller.update);

// delete
router.delete("/delete/:id", controller.delete);

module.exports = router;