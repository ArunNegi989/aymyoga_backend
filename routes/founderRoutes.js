const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  create,
  getFounder,
  update,
  remove,
} = require("../controllers/ourTeachers/founderController");

/* =========================
   ROUTES
========================= */

// CREATE
router.post("/create-founder", upload.single("image"), create);

// GET
router.get("/get-founder", getFounder);

// UPDATE
router.put("/update-founder/:id", upload.single("image"), update);

// DELETE
router.delete("/delete-founder/:id", remove);

module.exports = router;