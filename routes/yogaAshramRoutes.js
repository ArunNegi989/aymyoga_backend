const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getYogaAshramSection,
  getYogaAshramSectionById,
  createYogaAshramSection,
  updateYogaAshramSection,
  deleteYogaAshramSection,
} = require("../controllers/yogaAshramController");

const ashramUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "featureImage", maxCount: 1 },
  { name: "ashramPhoto", maxCount: 1 },
]);

router.get("/", getYogaAshramSection);

router.get("/:id", getYogaAshramSectionById);

router.post("/", ashramUpload, createYogaAshramSection);

router.put("/:id", ashramUpload, updateYogaAshramSection);

router.delete("/:id", deleteYogaAshramSection);

module.exports = router;