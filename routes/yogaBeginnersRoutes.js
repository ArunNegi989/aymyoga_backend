const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const yogaBeginnersController = require("../controllers/yogaBeginnersController");

const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "secondImage", maxCount: 1 },
]);


router.get("/", yogaBeginnersController.getAll);
router.get("/:id", yogaBeginnersController.getById);
router.post("/", uploadFields, yogaBeginnersController.create);
router.put("/:id", uploadFields, yogaBeginnersController.update);
router.delete("/:id", yogaBeginnersController.remove);

module.exports = router;