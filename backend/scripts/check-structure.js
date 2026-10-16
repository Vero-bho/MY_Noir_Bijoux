"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const files = [
  "package.json",
  "package-lock.json",
  ".env.example",
  ".gitignore",
  ".dockerignore",
  "Dockerfile",
  "docker-compose.yml",
  "prisma7.config.ts",
  "src/server.ts",
  "src/app.ts",
  "src/config/env.ts",
  "src/middleware/errorHandler.ts",
  "src/middleware/notFound.ts",
  "src/middleware/validate.ts",
  "src/modules/health/health.routes.ts",
  "src/modules/products/products.routes.ts",
  "src/modules/components/components.routes.ts",
  "src/modules/builds/builds.routes.ts",
  "src/modules/orders/orders.routes.ts",
  "src/modules/delivery/delivery.routes.ts",
  "src/prisma/schema/schema.prisma",
  "src/prisma/client.ts",
  "src/prisma/seed.ts",
  "src/prisma/migrations/20261007120000_init/migration.sql",
  "sql-postgres/00_create_all_simple.sql",
  "sql-postgres/01_schema.sql",
  "sql-postgres/02_indexes.sql",
  "sql-postgres/03_seed.sql",
  "sql-postgres/04_verify.sql",
  "sql-postgres/05_drop.sql",
  "tests/api.test.js",
  "tests/guest-mode.test.js",
  "tests/seed.test.js",
  "tests/sql-postgres.test.js",
];

const retired = [
  "src/modules/auth",
  "src/modules/admin",
  "src/modules/favorites",
  "src/modules/profile",
  "src/middleware/auth.ts",
  "src/utils/jwt.ts",
  "src/utils/password.ts",
  "src/config/swagger.ts",
];

const missing = files.filter((file) => !fs.existsSync(path.join(ROOT, file)));
const remainingAuth = retired.filter((file) => fs.existsSync(path.join(ROOT, file)));

console.log("Проверка структуры Noir Bijoux backend");
console.log(`Файлов на месте: ${files.length - missing.length}/${files.length}`);
for (const file of missing) console.log(`✘ ${file}`);
console.log(`Остатки авторизационного кода: ${remainingAuth.length}`);
for (const file of remainingAuth) console.log(`✘ ${file}`);

if (missing.length || remainingAuth.length) {
  process.exitCode = 1;
} else {
  console.log("OK: Supabase, Docker, публичные API и тесты сохранены.");
}
