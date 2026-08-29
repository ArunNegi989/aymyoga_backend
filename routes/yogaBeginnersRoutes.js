const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const yogaBeginnersController = require("../controllers/yogaBeginnersController");

// Accepts the top hero image and the second hero image
const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "secondImage", maxCount: 1 },
]);

/* =========================
   YOGA BEGINNERS SECTION ROUTES (singleton)
   Note: seat batches (dates/pricing/booking) are handled by the
   existing separate "/yoga-beginners-seats" routes — untouched here.
========================= */
router.get("/", yogaBeginnersController.getAll);
router.get("/:id", yogaBeginnersController.getById);
router.post("/", uploadFields, yogaBeginnersController.create);
router.put("/:id", uploadFields, yogaBeginnersController.update);
router.delete("/:id", yogaBeginnersController.remove);

module.exports = router;