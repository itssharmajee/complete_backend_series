import redisClient from "../config/redis.config.js";
import { URL } from "../models/url.model.js";

new Worker(
    "clickQueue",
    async (job) => {
        console.log("🔥 JOB RECEIVED:", job.data);

        const { shortCode } = job.data;

        const clickKey = `clicks:${shortCode}`;
        const clicks = await redisClient.get(clickKey);

        console.log("👉 Redis clicks:", clicks);

        if (!clicks) {
            console.log("❌ No clicks found in Redis");
            return;
        }

        await URL.findOneAndUpdate(
            { shortCode },
            { $inc: { clicks: Number(clicks) } }
        );

        console.log(`✅ DB updated for ${shortCode}`);

        await redisClient.del(clickKey);
    }
);