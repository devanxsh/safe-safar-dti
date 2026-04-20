"use strict";

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["trip", "search", "alert", "emergency"],
      required: true,
    },
    routeNumber: { type: String, trim: true },
    fromStop: { type: String, trim: true },
    toStop: { type: String, trim: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    notes: { type: String, trim: true, maxlength: 500 },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
