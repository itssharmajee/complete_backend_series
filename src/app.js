import express from "express";
import cors from "cors";
import { appConfig } from "./config/app.config.js";
import { APIResponse } from "./utils/apiResponse.utils.js";
import { logger } from "./config/logger.config.js";
import { httpLogger } from "./middlewares/logger.middleware.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { mainRouter } from "./routes/index.routes.js";

const app = express();
app.use(cors(appConfig.cors));

app.use(httpLogger);
app.use(express.json({ limit: "10kb" })); // limit size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // we give access to nested
app.use(express.static("public"));// setting static folder

app.get('/health', (req, res) => {
    res.status(200).json(new APIResponse(200, {}, "Server is running...."));
})

// Routes
app.use(appConfig.app.apiPrefix, mainRouter);

app.use(globalErrorHandler);
export {
    app
}

