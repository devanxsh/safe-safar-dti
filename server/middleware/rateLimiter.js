"use strict";

const rateLimit = require("express-rate-limit");

/**
 * Create a rate limiter middleware.
 * @param {number} maxRequests - Maximum requests per window.
 * @param {number} windowMinutes - Window size in minutes.
 */
function createRateLimiter(maxRequests = 100, windowMinutes = 15) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1_000,
    max: maxRequests,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests — please try again later.",
    },
  });
}

/** Stricter limiter for authentication routes (20 req / 15 min). */
const authRateLimiter = createRateLimiter(20, 15);

module.exports = { createRateLimiter, authRateLimiter };
