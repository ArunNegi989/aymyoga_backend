const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createYoga200,
  getYoga200,
  getSingleYoga200,
  updateYoga200,
  deleteYoga200,
} = require("../controllers/coursecontrollers/yoga200Controller");

/* =========================
   MULTER FIELDS
========================= */
const multiUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "ashtangaImage", maxCount: 1 },
  { name: "hathaImage", maxCount: 1 },
  { name: "requirementsImage", maxCount: 1 },

  { name: "accommodationImages", maxCount: 8 },
  { name: "foodImages", maxCount: 8 },
  { name: "luxuryImages", maxCount: 4 },
  { name: "scheduleImages", maxCount: 4 },
]);

/* =========================
   ROUTES
========================= */

router.post("/create", multiUpload, createYoga200);
router.get("/all", getYoga200);
router.get("/:id", getSingleYoga200);
router.put("/update/:id", multiUpload, updateYoga200);
router.delete("/delete/:id", deleteYoga200);

module.exports = router;