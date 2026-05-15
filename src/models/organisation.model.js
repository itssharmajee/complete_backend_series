import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Organization name is required"],
            trim: true,
        },

        slug: {
            type: String,
            required: [true, "Organization slug is required"],
            trim: true,
            lowercase: true,
        },

        logo: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            trim: true,
            default: "",
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        address: {
            street: {
                type: String,
                trim: true,
                default: "",
            },

            city: {
                type: String,
                trim: true,
                default: "",
            },

            state: {
                type: String,
                trim: true,
                default: "",
            },

            country: {
                type: String,
                trim: true,
                default: "",
            },

            zipCode: {
                type: String,
                trim: true,
                default: "",
            },
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        subscriptionPlan: {
            type: String,
            enum: ["free", "basic", "pro", "enterprise"],
            default: "free",
        },

        subscriptionExpiresAt: {
            type: Date,
            default: null,
        },

        settings: {
            timezone: {
                type: String,
                default: "UTC",
            },

            currency: {
                type: String,
                default: "USD",
            },

            language: {
                type: String,
                default: "en",
            },
        },
    },
    {
        timestamps: true,
    }
);

organizationSchema.index({ slug: 1 }, { unique: true });

export const Organization = mongoose.model(
    "Organization",
    organizationSchema
);
