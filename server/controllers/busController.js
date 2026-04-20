"use strict";

const Activity = require("../models/Activity");

// ─── In-memory bus state ──────────────────────────────────────────────────────
// In production, this data would come from a real-time feed (GTFS-RT, WebSocket, etc.)

const LIVE_BUSES = [
  { id: "bus-1", routeNumber: "Route 15", location: { lat: 28.6139, lng: 77.209 }, occupancy: "medium", status: "on-time", eta: 3, speed: 32, busNumber: "UP-14-AB-1234", driverName: "Raj Kumar" },
  { id: "bus-2", routeNumber: "Route 22", location: { lat: 28.6129, lng: 77.2295 }, occupancy: "high", status: "delayed", eta: 8, speed: 18, busNumber: "UP-14-CD-5678", driverName: "Suresh Singh" },
  { id: "bus-3", routeNumber: "Route 15", location: { lat: 28.6449, lng: 77.2167 }, occupancy: "low", status: "on-time", eta: 12, speed: 40, busNumber: "UP-14-EF-9012", driverName: "Mohan Das" },
];

/**
 * GET /api/buses?route=<routeNumber>
 */
async function getActiveBuses(req, res, next) {
  try {
    const { route } = req.query;
    const buses = route ? LIVE_BUSES.filter((b) => b.routeNumber === route) : LIVE_BUSES;
    return res.json({ success: true, data: buses });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/buses/:id/live
 */
async function getBusLiveData(req, res, next) {
  try {
    const bus = LIVE_BUSES.find((b) => b.id === req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    const liveData = {
      ...bus,
      currentLocation: "Near Central Market",
      nextStop: "Medical College Gate",
      totalStops: 12,
      completedStops: 8,
    };

    return res.json({ success: true, data: liveData });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/buses/route/live?route=<routeNumber>
 */
async function getRouteLiveData(req, res, next) {
  try {
    const { route } = req.query;
    if (!route) return res.status(400).json({ success: false, message: "'route' query parameter is required" });

    const bus = LIVE_BUSES.find((b) => b.routeNumber === route);
    if (!bus) return res.status(404).json({ success: false, message: "No live bus found for this route" });

    const liveData = {
      ...bus,
      currentLocation: bus.status === "delayed" ? "Stuck in traffic" : "Near Central Market",
      nextStop: "Medical College Gate",
      totalStops: 12,
      completedStops: 8,
    };

    return res.json({ success: true, data: liveData });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/buses/report
 * Report a bus issue. Requires authentication.
 */
async function reportBusIssue(req, res, next) {
  try {
    const { busId, type, description } = req.body;
    if (!busId || !type) {
      return res.status(400).json({ success: false, message: "'busId' and 'type' are required" });
    }

    await Activity.create({
      userId: req.user.id,
      type: "alert",
      notes: `Reported issue on bus ${busId}: ${type}. ${description ?? ""}`.trim(),
    });

    return res.json({ success: true, message: "Issue reported. Thank you for helping keep commuters safe!" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getActiveBuses, getBusLiveData, getRouteLiveData, reportBusIssue };
