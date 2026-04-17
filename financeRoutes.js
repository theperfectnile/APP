const express = require("express");
const router = express.Router();

// Correct folder structure imports
const auth = require("./middleware/authMiddleware");
const {
  addEntry,
  getAll,
  summary,
  analyze
} = require("./controllers/financeController");

// Routes
router.post("/add", auth, addEntry);
router.get("/all", auth, getAll);
router.get("/summary", auth, summary);
router.post("/analyze", auth, analyze);

module.exports = router;
