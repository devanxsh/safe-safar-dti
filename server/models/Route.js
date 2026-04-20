"use strict";

const mongoose = require("mongoose");

const busStopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, trim: true },
  routes: [{ type: String }],
});

const routeSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Route number is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
    },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 }, // minutes
    distance: { type: String, required: true },
    frequency: { type: String, required: true },
    activeBuses: { type: Number, default: 0, min: 0 },
    nextArrival: { type: Number, default: 10, min: 0 }, // minutes
    occupancy: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    stops: [busStopSchema],
    // Encoded polyline or array of LatLng for the route path
    path: [{ lat: Number, lng: Number }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

routeSchema.index({ number: 1 });
routeSchema.index({ name: "text", from: "text", to: "text" });

module.exports = mongoose.model("Route", routeSchema);
