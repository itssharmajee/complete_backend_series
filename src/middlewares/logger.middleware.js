import pinoHttp from "pino-http";
import { logger } from "../config/logger.config.js";

export const httpLogger = pinoHttp({
  logger,

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  customErrorMessage(req, res, error) {
    return `${req.method} ${req.url} failed: ${error.message}`;
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        ip: req.ip,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});