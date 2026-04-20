"use strict";

const Route = require("../models/Route");
const BusStop = require("../models/BusStop");

/**
 * GET /api/routes
 * Return all active routes.
 */
async function getRoutes(req, res, next) {
  try {
    const routes = await Route.find({ isActive: true }).select("-stops -path -__v");
    return res.json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/routes/:id
 * Return a single route with full stop list and path.
 */
async function getRouteById(req, res, next) {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    return res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/routes/search?q=<query>
 * Full-text search across route names, from, and to fields.
 */
async function searchRoutes(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
    }

    const routes = await Route.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("-stops -path -__v");

    return res.json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/routes/stops?route=<routeNumber>
 * Return bus stops, optionally filtered to a route.
 */
async function getBusStops(req, res, next) {
  try {
    const routeParam = req.query.route;
    // Only use the param if it's a plain string — reject objects to prevent injection
    const filter =
      routeParam && typeof routeParam === "string"
        ? { routes: { $eq: routeParam }, isActive: true }
        : { isActive: true };
    const stops = await BusStop.find(filter).select("-__v");
    return res.json({ success: true, data: stops });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/routes/path?origin=<address>&destination=<address>
 * Returns a simple route path.
 * In production, proxy to the Google Maps Directions API server-side
 * so the API key is never exposed in the client.
 */
async function getRoutePath(req, res, next) {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: "'origin' and 'destination' are required" });
    }

    // Placeholder: call Google Directions API here with server-side key.
    // For now, return an empty path to preserve the API contract.
    const path = [];

    return res.json({ success: true, data: { origin, destination, path } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRoutes, getRouteById, searchRoutes, getBusStops, getRoutePath };
