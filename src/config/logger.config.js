import pino from "pino";
import path from "path";
import fs from "fs";
import { appConfig } from "./app.config.js";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transport =
  process.env.NODE_ENV === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined;

export const logger = pino({
  level: appConfig.logging.level,

  timestamp: pino.stdTimeFunctions.isoTime,

  base: {
    env: process.env.NODE_ENV,
  },

  redact: {
    paths: [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "authorization",
      "req.headers.authorization",
    ],
    censor: "[REDACTED]",
  },

  transport,
});