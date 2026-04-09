const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/homepage/aymFullPageController");

/* MULTI IMAGE UPLOAD */
const multiUpload = upload.fields([
  { name: "bodyPlanesImage", maxCount: 1 },
  { name: "outdoorImage", maxCount: 1 },
   ...Array.from({ length: 20 }).map((_, i) => ({
    name: `facilityImage_${i}`,
    maxCount: 1,
  })),
]);



/* ROUTES */
router.post("/create", multiUpload, controller.create);
router.get("/get", controller.get);
router.put("/update", multiUpload, controller.update);
router.delete("/delete", controller.delete);

module.exports = router;