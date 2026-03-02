const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));

router.get("/", (req, res) => {
  res.json({ message: "API working 🚀" });
});

module.exports = router;