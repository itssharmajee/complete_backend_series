import { dbConnection } from "../src/config/database.config.js";
import { permissions } from "../src/constants/permission.js";
import { Permission } from "../src/models/permission.model.js";

export const seedPermissions = async () => {
    try {
        await dbConnection();

        let addedCount = 0;
        let existingCount = 0;

        for (const permission of permissions) {
            const result = await Permission.updateOne(
                { key: permission.key },
                { $setOnInsert: permission },
                { upsert: true }
            );

            // MongoDB v6+
            if (result.upsertedCount > 0) {
                addedCount++;
            } else {
                existingCount++;
            }
        }

        console.log("✅ Permissions seeding completed");
        console.log(`🆕 Added: ${addedCount}`);
        console.log(`♻️ Already Exists: ${existingCount}`);
        console.log(`📦 Total Processed: ${permissions.length}`);

    } catch (error) {
        console.error("❌ Permission seeding failed:", error);
    }
};