"use strict";

const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware.
 * Attaches `req.user` with `{ id, email }` if the token is valid.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
    return res.status(401).json({ success: false, message });
  }
}

module.exports = authenticateToken;
