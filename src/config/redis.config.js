import { createClient } from "redis";
import { appConfig } from "./app.config.js";
import logger from "../utils/logger.js";

// Build Redis URL safely
const redisUrl = appConfig.redis.password
    ? `redis://:${appConfig.redis.password}@${appConfig.redis.host}:${appConfig.redis.port}`
    : `redis://${appConfig.redis.host}:${appConfig.redis.port}`;

// Create client
const redisClient = createClient({
    url: redisUrl,

    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error("❌ Redis retry attempts exhausted");
                return new Error("Retry attempts exhausted");
            }
            const delay = Math.min(retries * 100, 3000);
            console.warn(`⚠️ Redis reconnecting... attempt ${retries}, delay ${delay}ms`);
            return delay;
        },
        connectTimeout: 10000, // 10 sec timeout
    },
});

// Event listeners
redisClient.on("connect", () => {
    console.info("✅ Redis connecting...");
});

redisClient.on("ready", () => {
    console.info("🚀 Redis ready to use");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
    logger.error("Redis Error", {
    error: err,
});
});

redisClient.on("end", () => {
    console.warn("⚠️ Redis connection closed");
});

redisClient.on("reconnecting", () => {
    console.warn("🔄 Redis reconnecting...");
});

// Connect function
export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.info("✅ Redis connected successfully");
        }
    } catch (err) {
        console.error("❌ Redis connection failed:", err.message);
        // process.exit(1); // Fail fast in production
    }
};

// Graceful shutdown
const shutdown = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            console.info("🛑 Redis disconnected gracefully");
        }
    } catch (err) {
        console.error("❌ Error during Redis shutdown:", err.message);
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Export client
export default redisClient;