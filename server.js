import { seedPermissions } from "./scripts/persmission.seeder.js";
import { app } from "./src/app.js";
import { appConfig } from "./src/config/app.config.js";
import { dbConnection } from "./src/config/database.config.js";
import { logger } from "./src/config/logger.config.js";
import { bullConnection } from "./src/config/redis.config.js";

const PORT = appConfig.app.port;

logger.info(`Environment: ${appConfig.app.env || "development"}`);

let server;
let isShuttingDown = false;

const startServer = async () => {
    try {
        await dbConnection();
        logger.info("Database connected successfully");

        await bullConnection.connect();
        logger.info("Redis connected successfully");

        await seedPermissions();

        server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Server startup failed", error);
        process.exit(1);
    }
};

const gracefulShutdown = async (signal, error) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(` ${signal} received. Shutting down gracefully...`);

    if (error) {
        logger.error(error);
    }

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) return reject(err);
                    logger.info("HTTP server closed");
                    resolve();
                });
            });
        }

        try {
            await bullConnection.quit();
            logger.info("Redis connection closed");
        } catch (redisError) {
            logger.warn(`Redis close warning: ${redisError.message}`);
        }

        logger.info(" Graceful shutdown completed");
        process.exit(0);
    } catch (shutdownError) {
        logger.error("Error during graceful shutdown", shutdownError);
        process.exit(1);
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
    gracefulShutdown("uncaughtException", error);
});

process.on("unhandledRejection", (reason) => {
    gracefulShutdown("unhandledRejection", reason);
});

startServer();