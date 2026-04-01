const express = require("express");
const router  = express.Router();
const upload  = require("../middleware/upload");

const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/homepage/courseSectionController");

router.post(  "/",    upload.single("image"), createCourse);
router.get(   "/",    getAllCourses);
router.get(   "/:id", getSingleCourse);
router.put(   "/:id", upload.single("image"), updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;