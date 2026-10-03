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


router.post("/create-teacher", upload.single("image"), create);

router.get("/get-all-teachers", getAll);

router.get("/:id", getOne);

router.put("/update-teacher/:id", upload.single("image"), update);

router.delete("/delete-teacher/:id", remove);

module.exports = router;