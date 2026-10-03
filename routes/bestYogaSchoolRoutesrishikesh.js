const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/bestYogaSchoolControllerrishikesh");

router.post("/create", upload.any(), controller.create);


router.get("/get", controller.get);

router.put("/update", upload.any(), controller.update);

router.delete("/delete", controller.remove);

module.exports = router;
