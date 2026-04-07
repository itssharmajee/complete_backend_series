import { getCache, setCache } from "../utils/cache.js";

export const cacheGet = (keyPrefix, ttl = 300) => {
    return async (req, res, next) => {
        try {
            const key = `${keyPrefix}:${req.method}:${req.originalUrl}`;

            // 🔹 Check cache
            const cached = await getCache(key);
            if (cached) {
                return res.status(200).json({
                    success: true,
                    source: "cache",
                    data: cached,
                });
            }

            // 🔹 Override response
            const originalJson = res.json.bind(res);

            res.json = (body) => {
                if (body?.success && body?.data) {
                    setCache(key, body.data, ttl);
                }
                return originalJson(body);
            };

            next();
        } catch (err) {
            next(); // fail safe
        }
    };
};