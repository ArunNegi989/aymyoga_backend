const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/yogaTTCIndiaController");

const fields = [
  { name: "heroImage", maxCount: 1 },
  { name: "mediaImage", maxCount: 1 },
  { name: "whoWeAreVideo", maxCount: 1 },
  { name: "whoWeAreVideoPoster", maxCount: 1 },
  { name: "rishikeshImage", maxCount: 1 },
  { name: "goaImage", maxCount: 1 },
  { name: "whyAYMImage", maxCount: 1 },
];

for (let i = 0; i < 100; i++) {
  fields.push({ name: `accredBadgeImage_${i}`, maxCount: 1 });
  fields.push({ name: `courseCardImage_${i}`, maxCount: 1 });
  fields.push({ name: `quoteCardImage_${i}`, maxCount: 1 });
  fields.push({ name: `locationImage_${i}`, maxCount: 1 });
}


router.post("/create", upload.fields(fields), controller.create);
router.get("/", controller.getSingle);
router.put("/update", upload.fields(fields), controller.update);
router.delete("/delete", controller.remove);

module.exports = router;