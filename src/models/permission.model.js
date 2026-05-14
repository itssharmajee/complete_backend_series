import mongoose from "mongoose";
import { tenantPlugin } from "../utils/tenantUtils/tenant.plugin.js";

const permissionSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

permissionSchema.plugin(tenantPlugin);
export const Permission = mongoose.model('Permission', permissionSchema);
