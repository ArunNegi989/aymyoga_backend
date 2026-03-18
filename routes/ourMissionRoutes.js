const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/homepage/ourMissionController");

/* =========================
   OUR MISSION ROUTES 🔥
========================= */

// ✅ CREATE OUR MISSION BLOCK
router.post("/add-our-mission", create);

// ✅ GET ALL (ONLY ONE)
router.get("/get-our-mission", getAll);

// ✅ GET SINGLE BY ID
router.get("/get-our-mission/:id", getOne);

// ✅ UPDATE
router.put("/update-our-mission/:id", update);

// ✅ DELETE
router.delete("/delete-our-mission/:id", remove);

module.exports = router;