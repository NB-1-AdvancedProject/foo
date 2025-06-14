import YAML from "yamljs";
import SwaggerUi from "swagger-ui-express";
import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
