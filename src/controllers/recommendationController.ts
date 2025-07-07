import { RequestHandler } from "express";
import { create } from "superstruct";
import { IdParamsStruct } from "../structs/commonStructs";
import * as recommendationService from "../services/recommendationService";

export const getRecommendation: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const result = await recommendationService.getRecommendation(productId);
  res.status(200).json(result);
};
