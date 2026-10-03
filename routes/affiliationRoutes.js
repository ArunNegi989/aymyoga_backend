const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
  getAffiliation,
  getAffiliationById,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} = require("../controllers/affiliationController");

router.get("/", getAffiliation);

router.get("/:id", getAffiliationById);

router.post("/", upload.any(), createAffiliation);

router.put("/:id", upload.any(), updateAffiliation);

router.delete("/:id", deleteAffiliation);

module.exports = router;