import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { appConfig } from "./app.config.js";
import logger from "../utils/logger.js";

cloudinary.config({
  api_key: appConfig.cloudinary.api_key,
  cloud_name: appConfig.cloudinary.name,
  api_secret: appConfig.cloudinary.api_secret,
  secure: true,
});

export const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;

    const response = await cloudinary.uploader.upload(localfilePath, { resource_type: "auto" });
    logger.info("file uploaded successfully");
    console.log(response.url);
    return response;
  } catch (err) {
    fs.unlinkSync(localfilePath);// remove locally saved temporary file
    return null;
  }

}