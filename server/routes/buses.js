"use strict";

const express = require("express");
const { getActiveBuses, getBusLiveData, getRouteLiveData, reportBusIssue } = require("../controllers/busController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", getActiveBuses);
router.get("/route/live", getRouteLiveData);
router.get("/:id/live", getBusLiveData);

// Reporting an issue requires authentication
router.post("/report", authenticateToken, reportBusIssue);

module.exports = router;
