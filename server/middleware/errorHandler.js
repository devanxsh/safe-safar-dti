"use strict";

/**
 * Centralized error handling middleware.
 * Converts errors into consistent JSON responses.
 * Express requires all 4 parameters to recognize this as an error handler.
 */
function errorHandler(err, req, res, _next) {
  console.error("[Error]", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, [val.message]])
    );
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  // JWT errors (should be caught in auth middleware, but belt-and-suspenders)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  // CORS error
  if (err.message && err.message.startsWith("CORS:")) {
    return res.status(403).json({ success: false, message: err.message });
  }

  const status = err.statusCode ?? err.status ?? 500;
  const message = status < 500 ? err.message : "Internal server error";
  res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
