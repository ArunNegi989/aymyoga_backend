const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/coursecontrollers/hathaYogaController");


const uploadFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "introSideImage", maxCount: 1 },
  { name: "benefitsSideImage", maxCount: 1 },
  { name: "ashramImage", maxCount: 1 },
  { name: "certCardImage_0", maxCount: 1 },
  { name: "certCardImage_1", maxCount: 1 },
  { name: "certCardImage_2", maxCount: 1 },
  { name: "certCardImage_3", maxCount: 1 },
  { name: "certCardImage_4", maxCount: 1 },
]);


router.post("/create", uploadFields, controller.saveHathaYoga);
router.put("/update", uploadFields, controller.saveHathaYoga);
router.get("/", controller.getHathaYoga);
router.delete("/", controller.deleteHathaYoga);

module.exports = router;