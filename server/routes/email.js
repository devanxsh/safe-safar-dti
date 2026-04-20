"use strict";

const express = require("express");
const { sendContactForm, sendTripAlert, sendEmergencyAlert, contactValidation } = require("../controllers/emailController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Public: contact / support form
router.post("/contact", contactValidation, sendContactForm);

// Protected: trip and emergency alerts
router.post("/trip-alert", authenticateToken, sendTripAlert);
router.post("/emergency", authenticateToken, sendEmergencyAlert);

module.exports = router;
