import mongoose from "mongoose";
const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const URL = mongoose.model('Url', urlSchema);
