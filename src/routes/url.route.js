import express from "express";
import {
    createShortUrl,
    getUrls,
    getUrl,
    updateUrlController,
    deleteUrlController,
    redirectToUrl
} from "../controllers/url.controller.js";

const router = express.Router();

// Create a new short URL
router.route("/").post(createShortUrl);

// Get all URLs with optional filtering and pagination
router.route("/").get(getUrls);

// Get, update, delete URL by ID
router.route("/:id").get(getUrl);
router.route("/:id").put(updateUrlController);
router.route("/:id").delete(deleteUrlController);

// Redirect to original URL by short code
router.route("/redirect/:shortCode").get(redirectToUrl);

export default router;