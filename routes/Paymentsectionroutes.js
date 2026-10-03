const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); 


const {
  getPaymentSection,
  getPaymentSectionById,
  createPaymentSection,
  updatePaymentSection,
  deletePaymentSection,
} = require("../controllers/coursecontrollers/Paymentsectioncontroller");

const imageFields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "paypalLogo", maxCount: 1 },
  { name: "upiQr1", maxCount: 1 },
  { name: "upiQr2", maxCount: 1 },
]);


router.get("/", getPaymentSection);
router.get("/:id", getPaymentSectionById);

router.post("/", imageFields, createPaymentSection);
router.put("/:id", imageFields, updatePaymentSection);
router.delete("/:id", deletePaymentSection);

module.exports = router;