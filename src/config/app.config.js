import dotenv from "dotenv";
dotenv.config({ path: ['.env.local', '.env.sample'] })
export const appConfig = {
    app: {
        port: parseInt(process.env.PORT),
    },
    database: {
        uri: process.env.MONGODB_URI
    },

    jwt: {
        access_token_secret: process.env.JWT_SECRET,
        refresh_token_secret: process.env.JWT_SECRET,
        access_token_expireIn: process.env.JWT_EXPIRES_IN,
        refresh_token_expireIn: process.env.JWT_EXPIRES_IN,
    },

    corsOptions: {
        origin: "*", // ["http://localhost:3000", "https://yourdomain.com"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // allow cookies / auth headers
    },

    cloudinary: {
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        name: process.env.CLOUDINARY_CLOUD_NAME,
    },
    redis:{
        port:parseInt(6379),
        host:"localhost",
        password:""

    }
};
