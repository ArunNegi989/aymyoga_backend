const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
  getHolidays,
  getHolidaysById,
  createHolidays,
  updateHolidays,
  deleteHolidays,
} = require("../controllers/holidaysController");

router.get("/", getHolidays);

router.get("/:id", getHolidaysById);

router.post("/", upload.any(), createHolidays);

router.put("/:id", upload.any(), updateHolidays);

router.delete("/:id", deleteHolidays);

module.exports = router;