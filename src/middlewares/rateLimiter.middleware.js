// middlewares/rateLimiter.js
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { appConfig } from "../config/app.config.js";
import { bullConnection } from "../config/redis.config.js";

const HEALTH_PATHS = new Set(["/health", "/ping", "/ready"]);

const isRedisReady = (client) =>
  Boolean(
    client &&
      (client.status === "ready" ||
        client.isReady === true ||
        client.connected === true)
  );

const redisSendCommand = (client) => {
  if (!client) return undefined;

  return (...args) => {
    if (typeof client.sendCommand === "function") {
      return client.sendCommand(args);
    }

    if (typeof client.call === "function") {
      return client.call(...args);
    }

    throw new Error("Unsupported Redis client");
  };
};

const createRedisStore = (prefix, client) =>
  new RedisStore({
    prefix: `rl:${prefix}:`,
    sendCommand: redisSendCommand(client),
  });

const keyGenerator = (req) => {
  if (req.user?._id) return `uid:${String(req.user._id)}`;
  return `ip:${req.ip}`;
};

const handler = (message) => (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    status: options.statusCode,
    message,
    retryAfter: Math.ceil(options.windowMs / 1000),
  });
};

const createLimiter = ({
  prefix,
  windowMs,
  limit,
  message,
  skipFn,
  redisClient = bullConnection,
}) => {
  const useRedis = isRedisReady(redisClient);

  if (!useRedis) {
    console.warn(
      `[rate-limiter] Redis unavailable, using in-memory store for: ${prefix}`
    );
  }

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator,
    handler: handler(message),
    passOnStoreError: true,
    store: useRedis ? createRedisStore(prefix, redisClient) : undefined,
    skip: (req) =>
      process.env.NODE_ENV === "test" ||
      req.method === "OPTIONS" ||
      HEALTH_PATHS.has(req.path) ||
      Boolean(skipFn?.(req)),
  });
};

export const globalLimiter = createLimiter({
  prefix: "global",
  windowMs: appConfig.rateLimiter.global.windowMs,
  limit: appConfig.rateLimiter.global.max,
  message: "Too many requests, please try again later",
});

export const authLimiter = createLimiter({
  prefix: "auth",
  windowMs: appConfig.rateLimiter.auth.windowMs,
  limit: appConfig.rateLimiter.auth.max,
  message: "Too many authentication attempts, please try again in 15 minutes",
});

export const resendInvitationLimiter = createLimiter({
  prefix: "resend-invitation",
  windowMs: appConfig.rateLimiter.resendInvitation.windowMs,
  limit: appConfig.rateLimiter.resendInvitation.max,
  message: "Too many invitation resend attempts, please try again later",
});

export const uploadLimiter = createLimiter({
  prefix: "upload",
  windowMs: appConfig.rateLimiter.upload.windowMs,
  limit: appConfig.rateLimiter.upload.max,
  message: "Upload limit reached, please try again later",
});

export const scheduleLimiter = createLimiter({
  prefix: "schedule",
  windowMs: appConfig.rateLimiter.schedule.windowMs,
  limit: appConfig.rateLimiter.schedule.max,
  message: "Scheduling limit reached, please try again later",
});

export const partnershipRequestLimiter = createLimiter({
  prefix: "partnership-request",
  windowMs: appConfig.rateLimiter.partnershipRequest.windowMs,
  limit: appConfig.rateLimiter.partnershipRequest.max,
  message: "Partnership request limit reached, please try again tomorrow",
});