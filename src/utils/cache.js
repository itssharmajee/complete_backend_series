import redisClient from "../config/redis.config.js";
import logger from "../utils/logger.js";

// 🔹 GET
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        if (data) {
            logger.info(`Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        logger.info(`Cache MISS: ${key}`);
        return null;
    } catch (err) {
        logger.error(err);
        return null;
    }
};

// 🔹 SET
export const setCache = async (key, data, ttl = 300) => {
    try {
        await redisClient.set(key, JSON.stringify(data), {
            EX: ttl,
        });
        logger.info(`Cache SET: ${key}`);
    } catch (err) {
        logger.error(err);
    }
};

// 🔹 DELETE
export const deleteCache = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            logger.info(`Cache DELETE: ${pattern}`);
        }
    } catch (err) {
        logger.error(err);
    }
};