import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  deleteProduct,
  getProducts,
  patchProduct,
  postProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.get("/", asyncHandler(getProducts));
productRouter.post("/", authMiddleware, asyncHandler(postProduct));
productRouter.patch("/:id", authMiddleware, asyncHandler(patchProduct));
productRouter.delete("/:id", authMiddleware, asyncHandler(deleteProduct));

export default productRouter;
