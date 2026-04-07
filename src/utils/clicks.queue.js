import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import redisClient from "../config/redis.config.js";
import { URL as UrlModel } from "../models/url.model.js";

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null, // ✅ REQUIRED
});

console.log("🚀 Worker started...");

new Worker(
    "clickQueue",
    async (job) => {
        console.log("🔥 JOB RECEIVED:", job.data);

        const { shortCode } = job.data;

        const clickKey = `clicks:${shortCode}`;
        const clicks = await redisClient.get(clickKey);

        console.log("👉 Redis clicks:", clicks);

        if (!clicks) return;

        await UrlModel.findOneAndUpdate(
            { shortCode },
            { $inc: { clicks: Number(clicks) } }
        );

        await redisClient.del(clickKey);

        console.log(`✅ Updated clicks for ${shortCode}`);
    },
    { connection }
);

export const clickQueue = new Queue("clickQueue", {
    connection,
});

