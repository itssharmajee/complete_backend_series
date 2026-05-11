import express from "express";
import { APIResponse } from "../utils/apiResponse.utils.js";

export const mainRouter = express.Router();

mainRouter.get("/",(req, res, next)=>{
    res.status(200).json(new APIResponse(200,{},"Ok"))
})