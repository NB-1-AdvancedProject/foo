import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getRecommendation } from "../controllers/recommendationController";

export const recommendationRouter = express.Router();

recommendationRouter.get("/:id", asyncHandler(getRecommendation));
