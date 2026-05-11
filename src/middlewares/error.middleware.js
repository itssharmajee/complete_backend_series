import { logger } from "../config/logger.config.js";

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Request scoped logger from pino-http
    // Fallback to global logger

    const requestLogger = req.log || logger;

    // Log Error

    requestLogger.error(
        {
            err,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userId: req.user?._id || null,
            body: req.body,
            params: req.params,
            query: req.query,
        },
        err.message || "Internal Server Error"
    );

    // Response

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message:
            process.env.NODE_ENV === "production"
                ? statusCode === 500
                    ? "Internal Server Error"
                    : err.message
                : err.message,

        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};