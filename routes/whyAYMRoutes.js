const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // 👈 IMPORTANT

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/whyAYMController");

/* =========================
   WHY AYM ROUTES
========================= */

// CREATE (only once + image)
router.post(
  "/create-why-aym",
  upload.single("image"), // 👈 MUST
  create
);

// GET ALL WHY AYM DATA
router.get("/get-all-why-aym", getAll);

// GET SINGLE WHY AYM BY ID
router.get("/get-why-aym/:id", getOne);

// UPDATE WHY AYM (with image replace)
router.put(
  "/update-why-aym/:id",
  upload.single("image"), // 👈 MUST
  update
);

// DELETE WHY AYM
router.delete("/delete-why-aym/:id", remove);

module.exports = router;