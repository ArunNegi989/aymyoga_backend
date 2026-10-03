const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getAllYogaCollegeSections,
  getYogaCollegeSectionById,
  createYogaCollegeSection,
  updateYogaCollegeSection,
  deleteYogaCollegeSection,
} = require("../controllers/coursecontrollers/Yogacollegesectioncontroller");

const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "aimImage1", maxCount: 1 },
  { name: "aimImage2", maxCount: 1 },
  { name: "aimImage3", maxCount: 1 },
  { name: "introImage", maxCount: 1 },
  { name: "highlightImage", maxCount: 1 },
  { name: "collegeImage", maxCount: 1 },
  { name: "maObjectivesImage", maxCount: 1 },
  { name: "careerImage", maxCount: 1 },
  { name: "courseImage_0", maxCount: 1 },
  { name: "courseImage_1", maxCount: 1 },
  { name: "courseImage_2", maxCount: 1 },
  { name: "courseImage_3", maxCount: 1 },
  { name: "courseImage_4", maxCount: 1 },
  { name: "courseImage_5", maxCount: 1 },
]);

router.get("/", getAllYogaCollegeSections);
router.get("/:id", getYogaCollegeSectionById);
router.post("/", uploadFields, createYogaCollegeSection);
router.put("/:id", uploadFields, updateYogaCollegeSection);
router.delete("/:id", deleteYogaCollegeSection);

module.exports = router;