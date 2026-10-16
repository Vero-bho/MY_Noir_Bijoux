import { Router } from "express";
import { prisma } from "../../prisma/client";

const router = Router();

router.get("/health", async (_req, res) => {
  let database = "not checked";

  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    database = "connected";
  } catch {
    database = "unavailable";
  }

  res.json({ status: "ok", database, time: new Date().toISOString() });
});

export default router;
