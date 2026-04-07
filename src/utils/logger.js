import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// 🎨 Colors
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
});

// 🔹 Format
// const logFormat = printf(({ level, message, timestamp, stack }) => {
//   return `${timestamp} [${level}]: ${stack || message}`;
// });

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

// 🔹 Logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "http",
  levels: winston.config.npm.levels, // 👈 includes http level
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});


// 🔹 Console (dev)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp(),
        errors({ stack: true }),
        logFormat
      ),
    })
  );
}

// 🔥 Morgan stream
logger.stream = {
  write: (message) => {
    logger.http(message.trim()); // 👈 use http level
  },
};

export default logger;