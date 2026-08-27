const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // the multer config you shared
const {
  getHolidays,
  getHolidaysById,
  createHolidays,
  updateHolidays,
  deleteHolidays,
} = require("../controllers/holidaysController");

/**
 * upload.any() handles the three fixed single-image fields:
 *   heroImage / mediaImage / campImage
 */

// GET /api/holidays-section        → singleton fetch
router.get("/", getHolidays);

// GET /api/holidays-section/:id    → fetch by id (edit page)
router.get("/:id", getHolidaysById);

// POST /api/holidays-section       → create (first time only)
router.post("/", upload.any(), createHolidays);

// PUT /api/holidays-section/:id    → update
router.put("/:id", upload.any(), updateHolidays);

// DELETE /api/holidays-section/:id
router.delete("/:id", deleteHolidays);

module.exports = router;