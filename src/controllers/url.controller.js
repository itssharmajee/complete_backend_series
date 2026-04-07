import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import redisClient from "../config/redis.config.js";
import { clickQueue } from "../utils/clicks.queue.js";
import {URL} from "../models/url.model.js"
// 🔹 Helpers (fail-safe Redis)
const safeGet = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const safeSet = async (key, value, ttl = 300) => {
    try {
        await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    } catch { }
};

// 🔹 Create a new short URL
export const createShortUrl = asyncHandler(async (req, res) => {
    const { originalUrl, shortCode } = req.body;

    if (!originalUrl) {
        throw new ApiError(400, "Original URL is required");
    }

    let code = shortCode || Math.random().toString(36).substring(2, 8);

    const url = await URL.create({ originalUrl, shortCode: code });

    // 🔥 Warm cache
    await safeSet(`url:${code}`, url, 3600);

    res.status(201).json(
        new APIResponse(201, url, "Short URL created successfully")
    );
});

// 🔹 Get all URLs (with Redis cache)
export const getUrls = asyncHandler(async (req, res) => {
    const { active, limit = 10, skip = 0 } = req.query;

    const cacheKey = `urls:all:${active || "all"}`;

    // 🔹 1. Check cache
    const cached = await safeGet(cacheKey);
    if (cached) {
        return res.status(200).json(
            new APIResponse(200, cached, "URLs retrieved from cache")
        );
    }

    const filter = {};
    if (active !== undefined) {
        filter.active = active === "true";
    }

    const urls = await URL.find(filter);

    const paginatedUrls = urls.slice(
        parseInt(skip),
        parseInt(skip) + parseInt(limit)
    );

    const responseData = {
        urls: paginatedUrls,
        total: urls.length,
        limit: parseInt(limit),
        skip: parseInt(skip),
    };

    // 🔥 Cache (short TTL)
    await safeSet(cacheKey, responseData, 120);

    res.status(200).json(
        new APIResponse(200, responseData, "URLs retrieved successfully")
    );
});

// 🔹 Get URL by ID (with cache)
export const getUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cacheKey = `url:id:${id}`;

    const cached = await safeGet(cacheKey);
    if (cached) {
        return res.status(200).json(
            new APIResponse(200, cached, "URL retrieved from cache")
        );
    }

    const url = await URL.findById(id);

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    await safeSet(cacheKey, url, 300);

    res.status(200).json(
        new APIResponse(200, url, "URL retrieved successfully")
    );
});

// 🔹 Update URL
export const updateUrlController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const url = await URL.findByIdAndUpdate(id, req.body);

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    // 🔥 Invalidate cache
    await redisClient.del(`url:${url.shortCode}`);
    await redisClient.del(`url:id:${url._id}`);
    await redisClient.del("urls:all:all");

    res.status(200).json(
        new APIResponse(200, url, "URL updated successfully")
    );
});

// 🔹 Delete URL
export const deleteUrlController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const url = await URL.findByIdAndDelete(id);

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    // 🔥 Clear cache
    await redisClient.del(`url:${url.shortCode}`);
    await redisClient.del(`url:id:${url._id}`);
    await redisClient.del(`clicks:${url.shortCode}`);
    await redisClient.del("urls:all:all");

    res.status(200).json(
        new APIResponse(200, null, "URL deleted successfully")
    );
});

// 🔥 Redirect (FAST + Redis + Queue)
export const redirectToUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    const cacheKey = `url:${shortCode}`;
    const clickKey = `clicks:${shortCode}`;

    // 🔹 1. Get from Redis
    let url = await safeGet(cacheKey);

    if (!url) {
        url = await getUrlByShortCode(shortCode);

        if (!url) {
            throw new ApiError(404, "Short URL not found");
        }

        if (!url.active) {
            throw new ApiError(410, "Short URL is no longer active");
        }

        // 🔥 Cache for fast access
        await safeSet(cacheKey, url, 3600);
    }

    // 🔥 2. Increment click in Redis (instant ⚡)
    await redisClient.incr(clickKey);

    // 🔥 3. Schedule DB update after 2 min
    await clickQueue.add(
        "updateClick",
        { shortCode },
        {
            delay: 2 * 60 * 1000,
            jobId: shortCode, // prevent duplicate jobs
            removeOnComplete: true,
        }
    );

    // 🔹 4. Redirect
    return res.redirect(url.originalUrl);
});