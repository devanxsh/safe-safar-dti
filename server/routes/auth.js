"use strict";

const express = require("express");
const { signup, login, logout, refreshTokens, getProfile, signupValidation, loginValidation } = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");
const { authRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Apply stricter rate limiting to auth endpoints
router.use(authRateLimiter);

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.post("/refresh", refreshTokens);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
