"use strict";

const { body, validationResult } = require("express-validator");
const { sendContactEmail, sendTripAlertEmail, sendEmergencyAlertEmail } = require("../services/emailService");
const Activity = require("../models/Activity");

// ─── Validation ───────────────────────────────────────────────────────────────

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10–2000 characters"),
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/email/contact
 */
async function sendContactForm(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.mapped() });
    }

    const { name, email, subject, message } = req.body;
    await sendContactEmail({ name, email, subject, message });

    return res.json({ success: true, message: "Your message has been sent. We will get back to you shortly." });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/email/trip-alert
 * Send a trip progress alert to the user (requires auth).
 */
async function sendTripAlert(req, res, next) {
  try {
    const { email, routeNumber, nextStop, eta } = req.body;
    if (!email || !routeNumber || !nextStop || eta === undefined) {
      return res.status(400).json({ success: false, message: "email, routeNumber, nextStop, and eta are required" });
    }

    await sendTripAlertEmail({ email, routeNumber, nextStop, eta });
    await Activity.create({
      userId: req.user.id,
      type: "alert",
      routeNumber,
      notes: `Trip alert sent — arriving at ${nextStop} in ${eta} min`,
    });

    return res.json({ success: true, message: "Trip alert sent successfully." });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/email/emergency
 * Send an emergency location alert (requires auth).
 */
async function sendEmergencyAlert(req, res, next) {
  try {
    const { email, location, message } = req.body;
    if (!email || !location) {
      return res.status(400).json({ success: false, message: "email and location are required" });
    }

    await sendEmergencyAlertEmail({ email, location, message });
    await Activity.create({
      userId: req.user.id,
      type: "emergency",
      notes: `Emergency alert sent from lat:${location.lat}, lng:${location.lng}`,
    });

    return res.json({ success: true, message: "Emergency alert sent." });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendContactForm, sendTripAlert, sendEmergencyAlert, contactValidation };
