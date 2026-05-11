import IORedis from "ioredis";
import { appConfig } from "./app.config.js";

export const bullConnection = new IORedis({
  host: appConfig.redis.host,
  port: appConfig.redis.port,
  password: appConfig.redis.password || undefined,
  db: appConfig.redis.db,

  // Required for BullMQ
  maxRetriesPerRequest: null,

  // Production settings
  enableReadyCheck: true,
  lazyConnect: true,

  retryStrategy(times) {
    return Math.min(times * 1000, 30000);
  },

  reconnectOnError(err) {
    const targetErrors = [
      "READONLY",
      "ETIMEDOUT",
      "ECONNRESET",
      "EPIPE",
    ];

    return targetErrors.some((error) =>
      err.message.includes(error)
    );
  },
});


// Redis Events


bullConnection.on("connect", () => {
  console.log("✅ Redis connecting...");
});

bullConnection.on("ready", () => {
  console.log("✅ Redis connected");
});

bullConnection.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

bullConnection.on("close", () => {
  console.warn("⚠️ Redis connection closed");
});

bullConnection.on("reconnecting", () => {
  console.warn("🔄 Redis reconnecting...");
});


// Graceful Shutdown


const shutdown = async (signal) => {
  try {
    console.log(`🛑 Received ${signal}. Closing Redis connection...`);

    await bullConnection.quit();

    console.log("✅ Redis connection closed gracefully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error while closing Redis:", error.message);

    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));