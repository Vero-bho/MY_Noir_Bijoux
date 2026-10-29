import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import healthRoutes from "./modules/health/health.routes";
import productRoutes from "./modules/products/products.routes";
import componentRoutes from "./modules/components/components.routes";
import buildRoutes from "./modules/builds/builds.routes";
import deliveryRoutes from "./modules/delivery/delivery.routes";
import orderRoutes from "./modules/orders/orders.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
      skip: () => env.nodeEnv !== "production",
    }),
  );

  app.get("/", (_req, res) => res.json({ name: "Noir Bijoux API", status: "ok" }));
  app.use("/api", healthRoutes);
  app.use("/api", productRoutes);
  app.use("/api", componentRoutes);
  app.use("/api/builds", buildRoutes);
  app.use("/api/delivery", deliveryRoutes);
  app.use("/api/orders", orderRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n");
  });

  app.use("/api", (_req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
  });

  return app;
}
