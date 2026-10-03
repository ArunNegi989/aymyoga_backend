const express = require("express");
const router = express.Router();

const controller = require("../controllers/coursecontrollers/threeHundredBatch.controller");


router.post("/create", controller.createBatch);

router.get("/all", controller.getAllBatches);
router.get("/single/:id", controller.getSingleBatch);
router.get("/getBatch/:id", controller.getSingleBatch);

router.put("/update/:id", controller.updateBatch);

router.patch("/bookSeat/:id", controller.bookSeat);

router.delete("/delete/:id", controller.deleteBatch);

module.exports = router;