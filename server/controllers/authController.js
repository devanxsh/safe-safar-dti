"use strict";

const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Activity = require("../models/Activity");

// ─── Token helpers ────────────────────────────────────────────────────────────

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d" }
  );
}

function issueTokens(user) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

// ─── Validation rules ────────────────────────────────────────────────────────

const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 */
async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.mapped() });
    }

    // Explicitly cast to primitives — prevents NoSQL injection via object payloads
    const name = String(req.body.name).trim();
    const email = String(req.body.email).toLowerCase().trim();
    const password = String(req.body.password);

    const existing = await User.findOne({ email: { $eq: email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const tokens = issueTokens(user);

    await User.updateOne({ _id: user._id }, { $push: { refreshTokens: tokens.refreshToken }, lastLoginAt: new Date() });

    await Activity.create({ userId: user._id, type: "alert", notes: "Account created" });

    return res.status(201).json({
      success: true,
      data: { user: user.toPublicJSON(), tokens },
      message: "Account created successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.mapped() });
    }

    // Explicitly cast to primitives — prevents NoSQL injection via object payloads
    const email = String(req.body.email).toLowerCase().trim();
    const password = String(req.body.password);

    const user = await User.findOne({ email: { $eq: email }, isActive: true }).select("+password +refreshTokens");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const tokens = issueTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    return res.json({
      success: true,
      data: { user: user.toPublicJSON(), tokens },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    const rawToken = req.body.refreshToken;
    // Only proceed if the token is a plain string — reject objects to prevent injection
    if (rawToken && typeof rawToken === "string") {
      await User.updateOne(
        { refreshTokens: { $eq: rawToken } },
        { $pull: { refreshTokens: rawToken } }
      );
    }
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 */
async function refreshTokens(req, res, next) {
  try {
    const rawToken = req.body.refreshToken;
    // Reject non-string tokens immediately to prevent NoSQL injection
    if (!rawToken || typeof rawToken !== "string") {
      return res.status(400).json({ success: false, message: "Refresh token is required and must be a string" });
    }
    const refreshToken = rawToken;

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findOne({
      _id: { $eq: decoded.id },
      refreshTokens: { $eq: refreshToken },
    }).select("+refreshTokens");
    if (!user) {
      return res.status(401).json({ success: false, message: "Refresh token not recognized" });
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const tokens = issueTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.json({ success: true, data: { tokens } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/profile (requires auth)
 */
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
  logout,
  refreshTokens,
  getProfile,
  signupValidation,
  loginValidation,
};
