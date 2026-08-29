const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // the multer config you shared
const {
  getRules,
  getRulesById,
  createRules,
  updateRules,
  deleteRules,
} = require("../controllers/rulesController");

// GET /api/rules-section        → singleton fetch
router.get("/", getRules);

// GET /api/rules-section/:id    → fetch by id (edit page)
router.get("/:id", getRulesById);

// POST /api/rules-section       → create (first time only)
router.post("/", upload.any(), createRules);

// PUT /api/rules-section/:id    → update
router.put("/:id", upload.any(), updateRules);

// DELETE /api/rules-section/:id
router.delete("/:id", deleteRules);

module.exports = router;