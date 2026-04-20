"use strict";

const mongoose = require("mongoose");

let isConnected = false;

/**
 * Connect to MongoDB. Safe to call multiple times — reuses the connection.
 */
async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 removes the need for most legacy options,
      // but serverSelectionTimeoutMS is still useful.
      serverSelectionTimeoutMS: 5_000,
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected — attempting reconnect…");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
      isConnected = true;
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
