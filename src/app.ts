import YAML from "yamljs";
import SwaggerUi from "swagger-ui-express";
import express from "express";
import passport from "passport";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./controllers/errorController";
import authRouter from "./routers/authRouter";
import inquiryRouter from "./routers/inquiryRouter";
import { storeRouter } from "./routers/storeRouter";
import userRouter from "./routers/userRouter";
import productRouter from "./routers/productRouter";
import cartRouter from "./routers/cartRouter";
import { dashboardRouter } from "./routers/dashboardRouter";
import uploadRouter from "./routers/uploadRouter";
import notificationRouter from "./routers/notificationRouter";
import { reviewRouter } from "./routers/reviewRouter";
import { metadataRouter } from "./routers/metadataRouter";
import orderRouter from "./routers/orderRouter";
import { recommendationRouter } from "./routers/recommendationRouter";

const app = express();
app.use(express.json());

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", version: "1.0.0" });
});

app.use("/api/inquiries", inquiryRouter);
app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/product", reviewRouter);
app.use("/api/review", reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/s3", uploadRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/metadata", metadataRouter);
app.use("/api/order", orderRouter);
app.use("/api/recommendations", recommendationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
