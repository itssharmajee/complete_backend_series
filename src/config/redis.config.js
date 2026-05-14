// config/redis.config.js
import IORedis from "ioredis";
import { appConfig } from "./app.config.js";
import { logger } from "./logger.config.js";

export const bullConnection = new IORedis({
  host: appConfig.redis.host || "127.0.0.1",
  port: appConfig.redis.port || 6379,
  password: appConfig.redis.password || undefined,
  db: appConfig.redis.db ?? 0,

  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,

  retryStrategy(times) {
    return Math.min(times * 1000, 30000);
  },

  reconnectOnError(err) {
    const targetErrors = ["READONLY", "ETIMEDOUT", "ECONNRESET", "EPIPE"];
    return targetErrors.some((code) => err.message.includes(code));
  },
});

bullConnection.on("connect", () => {
  logger.info("Redis connecting...");
});

bullConnection.on("ready", () => {
  logger.info("Redis connected");
});

bullConnection.on("error", (err) => {
  logger.error(`Redis error: ${err.message}`);
});

bullConnection.on("close", () => {
  logger.warn("Redis connection closed");
});

bullConnection.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});