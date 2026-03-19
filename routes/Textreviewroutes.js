const express = require("express");
const router  = express.Router();
const upload  = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/Textreviewcontroller");

/* =========================
   TEXT REVIEW ROUTES
========================= */

// CREATE TEXT REVIEW
router.post("/create-review", upload.single("avatar"), create);

// GET ALL TEXT REVIEWS
router.get("/all-reviews", getAll);

// GET SINGLE TEXT REVIEW
router.get("/review/:id", getOne);

// UPDATE TEXT REVIEW
router.put("/update-review/:id", upload.single("avatar"), update);

// DELETE TEXT REVIEW
router.delete("/delete-review/:id", remove);

module.exports = router;