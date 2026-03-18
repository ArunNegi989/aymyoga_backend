const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/classCampusAmenitiesController");

/* =========================
   MULTER FIELDS
========================= */
const fields = upload.fields([
  { name: "classSizeImage", maxCount: 1 },
  { name: "amenityImage", maxCount: 1 },
  { name: "campusImage_0" },
  { name: "campusImage_1" },
  { name: "campusImage_2" },
  { name: "campusImage_3" },
  { name: "campusImage_4" },
]);

/* =========================
   ROUTES
========================= */

router.post("/create", fields, create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/update", fields, update);
router.delete("/:id", remove);

module.exports = router;