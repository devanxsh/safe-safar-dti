"use strict";

const mongoose = require("mongoose");

const busStopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bus stop name is required"],
      trim: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: { type: String, trim: true },
    routes: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

busStopSchema.index({ location: "2dsphere" }); // geospatial index for nearby queries
busStopSchema.index({ routes: 1 });

module.exports = mongoose.model("BusStop", busStopSchema);
