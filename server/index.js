"use strict";

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");
const { createRateLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

// ─── Import routes ────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const routeRoutes = require("./routes/routes");
const busRoutes = require("./routes/buses");
const emailRoutes = require("./routes/email");

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT ?? 5000;

// Connect to MongoDB
connectDB();

// ─── Global middleware ────────────────────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS — restrict to the configured client origin
const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:5173").split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    credentials: true,
  })
);

// HTTP request logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Global rate limiter (100 req / 15 min per IP)
app.use(createRateLimiter(100, 15));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/email", emailRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`SafeSafar API listening on http://localhost:${PORT}`);
});

module.exports = app;
