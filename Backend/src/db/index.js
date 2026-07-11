import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

/**
 * Connects to MongoDB Atlas using Mongoose.
 * 
 * Includes connection listeners for success, failure, reconnection, 
 * disconnection, and hooks up process-level handlers for graceful shutdown.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    
    console.log(`\n✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection FAILED: ", error.message || error);
    process.exit(1);
  }
};

// Event Listeners for MongoDB connection lifecycle
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to Database.");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err.message || err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose connection is disconnected. Reconnecting might be attempted...");
});

mongoose.connection.on("reconnected", () => {
  console.log("Mongoose successfully reconnected to Database.");
});

/**
 * Handles graceful shutdown by closing Mongoose connection and exiting process.
 * @param {string} signal - The system signal that triggered the shutdown.
 */
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed through application termination.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing Mongoose connection during shutdown: ", error);
    process.exit(1);
  }
};

// Listen for process signals for clean shutdown
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default connectDB;
