import { app } from "./src/app.js";
import { appConfig } from "./src/config/app.config.js";
import { dbConnection } from "./src/config/database.config.js";
import { connectRedis } from "./src/config/redis.config.js";
import logger from "./src/utils/logger.js";
// dotenv.config({ path: ['.env.local', '.env'],debug:true })

const PORT = appConfig.app.port;

// 🔹 Log environment
logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);

// 🔹 App lifecycle (mostly useful for sub-apps)
app.on("mount", () => {
    logger.warn("Server stopped");
});

// 🔹 Initialize server
const startServer = async () => {
    try {
        // ✅ Connect DB
        await dbConnection();
        logger.info("Database connected successfully");
        await connectRedis();
        // ✅ Start server
        const server = app.listen(PORT, () => {
            logger.info(`Server is listening on port ${PORT}`);
        });

        // 🔹 Graceful shutdown
        process.on("SIGINT", () => {
            logger.warn("SIGINT received. Shutting down server...");

            server.close(() => {
                logger.info("HTTP server closed");
                process.exit(0);
            });
        });

        process.on("SIGTERM", () => {
            logger.warn("SIGTERM received. Shutting down server...");

            server.close(() => {
                logger.info("HTTP server closed");
                process.exit(0);
            });
        });

    } catch (err) {
        logger.error("Database connection failed", err);
        process.exit(1);
    }
};

// 🔹 Start everything
startServer();

