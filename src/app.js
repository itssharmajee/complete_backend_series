import express from "express";
import cors from "cors";
import { appConfig } from "./config/app.config.js";
import cookieParser from "cookie-parser";
import { APIResponse } from "./utils/api.response.js";
import errorHandler from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";
import morgan from "morgan";
import { ApiError } from "./utils/api.error.js";
import redisClient from "./config/redis.config.js";
import urlRouter from "./routes/url.route.js";
const app = express();

app.use(cors(appConfig.corsOptions));
app.use(cookieParser())

app.use(express.json({ limit: "10kb" })); // limit size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // we give access to nested
app.use(express.static("public"));// setting static folder
// app.use(errorHandler)

// 🔥 Morgan + Winston integration
app.use(
    morgan("combined", {
        stream: logger.stream,
    })
);
app.get('/', (req, res) => {
    let obj = {
        "name": "sapna"
    }
    res.json(new APIResponse(200, obj))
})

// Routes
app.use("/api/v1/urls", urlRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // 🔥 Log full error (for developers)
    logger.error(err.message, {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        stack: err.stack,
    });

    // 🔒 Safe response for client
    res.status(statusCode).json(new ApiError(statusCode, err.message, err, err.stack));
});
export {
    app
}

