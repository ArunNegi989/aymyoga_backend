const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const controller = require("../controllers/innerAwakeningController");

const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "maharishiImage", maxCount: 1 },
  { name: "galleryImage_0", maxCount: 1 },
  { name: "galleryImage_1", maxCount: 1 },
  { name: "galleryImage_2", maxCount: 1 },
]);

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", uploadFields, controller.create);
router.put("/:id", uploadFields, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;