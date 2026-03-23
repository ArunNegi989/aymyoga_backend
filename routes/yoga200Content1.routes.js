const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yoga200Content1.controller");

const multiUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "ashtangaImage", maxCount: 1 },
  { name: "hathaImage", maxCount: 1 },
]);

// CREATE
router.post("/create", multiUpload, controller.createContent1);

// GET ALL
router.get("/", controller.getAllContent1);

// GET ONE
router.get("/:id", controller.getContent1ById);

// UPDATE
router.put("/update/:id", multiUpload, controller.updateContent1);

// DELETE
router.delete("/delete/:id", controller.deleteContent1);

module.exports = router;