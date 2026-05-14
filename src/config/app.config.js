import dotenv from "dotenv";
dotenv.config({ path: ['.env.local', '.env.sample'] })

export const appConfig = {
    app: {
        name: process.env.APP_NAME || "my-app",
        env: process.env.NODE_ENV || "development",
        port: Number(process.env.PORT) || 5000,
        apiPrefix: process.env.API_PREFIX || "/api/v1",
    },
    database: {
        uri: process.env.MONGODB_URI
    },
    cors: {
        // origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
        origin: "*", // ["http://localhost:3000", "https://yourdomain.com"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // allow cookies / auth headers
    },

    rateLimiter: {
        // Global limiter
        global: {
            windowMs: 15 * 60 * 1000, // 15 min
            max: 100,
        },

        // Auth routes
        auth: {
            windowMs: 15 * 60 * 1000, // 15 min
            max: 10,
        },

        // Upload routes
        upload: {
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 20,
        },

        // Scheduling APIs
        schedule: {
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 50,
        },

        // Invitation resend
        resendInvitation: {
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 5,
        },

        // Partnership requests
        partnershipRequest: {
            windowMs: 24 * 60 * 60 * 1000, // 24 hours
            max: 5,
        },
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,

        accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
    },

    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || "",
        db: Number(process.env.REDIS_DB) || 0,

        retryDelay: 5000,
        maxRetriesPerRequest: null,
    },
    
    bullMQ: {
        removeOnComplete: 1000,
        removeOnFail: 5000,

        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 3000,
        },
    },

    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB

        allowedMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
    },
    cloudinary: {
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        name: process.env.CLOUDINARY_CLOUD_NAME,
    },

    bcrypt: {
        saltRounds: 10,
    },

    pagination: {
        defaultPage: 1,
        defaultLimit: 10,
        maxLimit: 100,
    },

    cache: {
        ttl: {
            short: 60, // 1 min
            medium: 60 * 5, // 5 min
            long: 60 * 60, // 1 hour
            day: 60 * 60 * 24, // 24 hour
        },
    },

    cookie: {
        accessToken: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        },

        refreshToken: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    },

    logging: {
        level: process.env.LOG_LEVEL || "info",
    },
};