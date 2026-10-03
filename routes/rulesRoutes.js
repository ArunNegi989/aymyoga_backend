const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
  getRules,
  getRulesById,
  createRules,
  updateRules,
  deleteRules,
} = require("../controllers/rulesController");

router.get("/", getRules);

router.get("/:id", getRulesById);

router.post("/", upload.any(), createRules);

router.put("/:id", upload.any(), updateRules);

router.delete("/:id", deleteRules);

module.exports = router;