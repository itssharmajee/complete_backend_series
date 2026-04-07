import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app.config.js";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // 🖼️ Multiple avatars
        avatars: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String, // for cloudinary/aws
                },
            },
        ],

        // 🖼️ Multiple cover images
        coverImages: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// pre middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// custom method

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        appConfig.jwt.access_token_secret,
        { expiresIn: appConfig.jwt.access_token_expireIn }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, appConfig.jwt.refresh_token_secret, {
        expiresIn: appConfig.jwt.refresh_token_expireIn,
    });
};

export const User = mongoose.model("User", userSchema);
