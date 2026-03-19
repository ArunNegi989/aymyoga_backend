const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/ourTeachers/teacherController");

/* =========================
   TEACHER ROUTES
========================= */

// CREATE
router.post("/create-teacher", upload.single("image"), create);

// GET ALL
router.get("/get-all-teachers", getAll);

// GET ONE
router.get("/:id", getOne);

// UPDATE
router.put("/update-teacher/:id", upload.single("image"), update);

// DELETE
router.delete("/delete-teacher/:id", remove);

module.exports = router;