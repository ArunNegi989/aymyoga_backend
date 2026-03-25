const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/coursecontrollers/ayurvedaCoursecontroller");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "introRightImage", maxCount: 1 },
  { name: "spicesStripImage", maxCount: 1 },
  { name: "sunsetImage", maxCount: 1 },

  ...Array.from({ length: 20 }, (_, i) => ({
    name: `ayurvedaCourseImage_${i}`,
    maxCount: 1,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    name: `panchaKarmaCourseImage_${i}`,
    maxCount: 1,
  })),
]);

router.post("/create", uploadFields, ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.put("/update/:id", uploadFields, ctrl.update);
router.delete("/delete/:id", ctrl.remove);

module.exports = router;