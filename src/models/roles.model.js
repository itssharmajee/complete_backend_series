import mongoose from "mongoose";
import { tenantPlugin } from "../utils/tenantUtils/tenant.plugin.js";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role name is required"],
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Permission",
            },
        ],
    },
    {
        timestamps: true,
    }
);

roleSchema.plugin(tenantPlugin);
roleSchema.index({ tenantId: 1, name: 1 }, { unique: true });
export const Role = mongoose.model("Role", roleSchema);
