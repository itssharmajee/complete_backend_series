import mongoose from "mongoose"
import { appConfig } from "./app.config.js";
import { logger } from "./logger.config.js";

const dbConnection = async () => {
    try {

        await mongoose.connect(appConfig.database.uri);
        mongoose.connection.on('connected', () => {
            logger.info(`Database: connected Successfully`);
        });

        mongoose.connection.on('error', (err) => {
            logger.error("Database failed", err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected from DB');
        });

    } catch (error) {
        logger.error("Database failed", err);
        process.exit(1);
    }
}
export { dbConnection }