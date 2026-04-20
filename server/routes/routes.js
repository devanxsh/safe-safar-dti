"use strict";

const express = require("express");
const { getRoutes, getRouteById, searchRoutes, getBusStops, getRoutePath } = require("../controllers/routeController");

const router = express.Router();

router.get("/", getRoutes);
router.get("/search", searchRoutes);
router.get("/stops", getBusStops);
router.get("/path", getRoutePath);
router.get("/:id", getRouteById);

module.exports = router;
