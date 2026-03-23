const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yoga200Content2controller");

const uploadFields = upload.fields([
  { name: "accomImages", maxCount: 8 },
  { name: "foodImages", maxCount: 8 },
  { name: "luxImages", maxCount: 4 },
  { name: "schedImages", maxCount: 4 },
  { name: "reqImage", maxCount: 1 },
]);

/* SINGLE RECORD ROUTES */
router.post("/create", uploadFields, controller.createContent);
router.get("/get", controller.getContent);
router.put("/update", uploadFields, controller.updateContent);
router.delete("/delete", controller.deleteContent);

module.exports = router;