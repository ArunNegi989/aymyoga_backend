const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yogaTTCIndiaController");

/* =========================
   MULTER FIELDS
========================= */
const fields = [{ name: "heroImage", maxCount: 1 }];

for (let i = 0; i < 50; i++) {
  fields.push({ name: `accredBadgeImage_${i}` });
  fields.push({ name: `courseCardImage_${i}` });
  fields.push({ name: `quoteCardImage_${i}` });
}

/* =========================
   ROUTES
========================= */

// create (only once)
router.post("/create", upload.fields(fields), controller.create);

// get single
router.get("/", controller.getSingle);

// update same record
router.put("/update", upload.fields(fields), controller.update);

// delete same record
router.delete("/delete", controller.remove);

module.exports = router;