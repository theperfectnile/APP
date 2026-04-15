const express = require("express");
const router = express.Router();

const { register, login } = require("./authController.js");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;
