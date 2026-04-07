import mongoose from "mongoose"
import { appConfig } from "./app.config.js";

const dbConnection = async () => {
    try {

        await mongoose.connect(appConfig.database.uri);
        console.log("Database connected Successfully");

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected from DB');
        });

    } catch (error) {
        console.log("error in database", error);
        process.exit(1);
    }
}
export  {dbConnection}