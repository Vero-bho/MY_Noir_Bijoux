import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Не задан DATABASE_URL — заполните файл .env (образец: .env.example)");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
