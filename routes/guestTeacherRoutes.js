const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/ourTeachers/guestTeacherController");

/* =========================
   GUEST TEACHER ROUTES
========================= */

router.post("/create-guest-teacher", upload.single("image"), create);
router.get("/get-all-guest-teachers", getAll);
router.get("/get-guest-teacher/:id", getOne);
router.put("/update-guest-teacher/:id", upload.single("image"), update);
router.delete("/delete-guest-teacher/:id", remove);

module.exports = router;