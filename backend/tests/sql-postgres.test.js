"use strict";

const fs = require("node:fs");
const path = require("node:path");

const BACKEND = path.join(__dirname, "..");
const ROOT = path.join(BACKEND, "..");
const SQL_DIR = path.join(BACKEND, "sql-postgres");
const SCHEMA_DIR = path.join(BACKEND, "src", "prisma", "schema");
const MIGRATION_DIR = path.join(BACKEND, "src", "prisma", "migrations");
const checks = [];

function check(name, passed, details = "") {
  checks.push({ name, passed });
  console.log(`  ${passed ? "✔" : "✘"} ${name}${details ? ` — ${details}` : ""}`);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function insertedRows(sql, table) {
  const start = sql.indexOf(`INSERT INTO "${table}"`);
  if (start === -1) return 0;
  const end = sql.indexOf(";", start);
  return (sql.slice(start, end).match(/^\s*\(/gm) ?? []).length;
}

function listFiles(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, result);
    else result.push(full);
  }
  return result;
}

async function main() {
  const required = [
    "00_create_all_simple.sql",
    "01_schema.sql",
    "02_indexes.sql",
    "03_seed.sql",
    "04_verify.sql",
    "05_drop.sql",
    "README.md",
  ];
  for (const file of required) check(`SQL-файл ${file} сохранён для Supabase`, fs.existsSync(path.join(SQL_DIR, file)));

  const schemaFile = path.join(SCHEMA_DIR, "schema.prisma");
  const schemaPrisma = read(schemaFile);
  const schema = read(path.join(SQL_DIR, "01_schema.sql"));
  const seed = read(path.join(SQL_DIR, "03_seed.sql"));
  const allInOne = read(path.join(SQL_DIR, "00_create_all_simple.sql"));
  const indexes = read(path.join(SQL_DIR, "02_indexes.sql"));
  const verify = read(path.join(SQL_DIR, "04_verify.sql"));
  const drop = read(path.join(SQL_DIR, "05_drop.sql"));
  const models = [...schemaPrisma.matchAll(/^model (\w+) \{/gm)].map((match) => match[1]);
  const tables = [...schema.matchAll(/CREATE TABLE "(\w+)"/g)].map((match) => match[1]);

  check("Prisma и PostgreSQL SQL-схема описывают 12 таблиц", models.length === 12 && tables.length === 12);
  check("Все модели Prisma сопоставлены с таблицами SQL", models.length === tables.length && schemaPrisma.includes('provider = "postgresql"'));
  check("Полный SQL для пустого Supabase-проекта содержит все таблицы", (allInOne.match(/CREATE TABLE "/g) ?? []).length === 12);
  check("PostgreSQL-миграция сохранена", fs.existsSync(path.join(MIGRATION_DIR, "20261007120000_init", "migration.sql")));

  const dataCounts = {
    categories: 4,
    materials: 3,
    products: 5,
    components: 48,
    pickup_points: 5,
  };
  for (const [table, expected] of Object.entries(dataCounts)) {
    const count = insertedRows(seed, table);
    check(`SQL seed заполняет ${table}: ${expected}`, count === expected, `найдено ${count}`);
  }

  check("SQL seed не создаёт демо-аккаунты", !/INSERT INTO "users"/i.test(seed));
  check("SQL seed не создаёт связанные с аккаунтами данные", !/INSERT INTO "(favorites|builds|orders)"/i.test(seed));
  check("SQL seed не содержит старых демонстрационных паролей", !/noir1234|admin1234|bcrypt/i.test(seed));
  check("Объединённый SQL seed также не содержит паролей и аккаунтов", !/noir1234|admin1234|INSERT INTO "users"/i.test(allInOne));

  const pngPaths = [...seed.matchAll(/'([^']+\.png)'/g)].map((match) => match[1]);
  const missingPng = pngPaths.filter((url) => !fs.existsSync(path.join(ROOT, "frontend", "public", url.replace(/^\//, ""))));
  check("Все PNG-пути seed существуют во frontend", pngPaths.length >= 40 && missingPng.length === 0, `ссылок: ${pngPaths.length}`);

  check("Индексы PostgreSQL сохранены", (indexes.match(/CREATE INDEX IF NOT EXISTS/g) ?? []).length === 7);
  check("SQL-проверки содержат запросы к индексам и объёму таблиц", verify.includes("pg_indexes") && verify.includes("pg_total_relation_size"));
  check("SQL-скрипт очистки таблиц сохранён", drop.includes("DROP TABLE IF EXISTS") && drop.includes("CASCADE"));
  check("Скрипты PostgreSQL не содержат команд MSSQL", !/\[dbo\]|\bGO\b|NVARCHAR|GETDATE\(\)/i.test(`${schema}\n${seed}\n${allInOne}`));

  const migration = read(path.join(MIGRATION_DIR, "20261007120000_init", "migration.sql"));
  check("Миграция Prisma совпадает с числом таблиц SQL", (migration.match(/CREATE TABLE "\w+"/g) ?? []).length === 12);
  check("PostgreSQL остаётся основной СУБД; локальная БД не добавлена", !fs.existsSync(path.join(BACKEND, "docker-compose.databases.yml")) && !fs.existsSync(path.join(BACKEND, "sql")));

  const authFiles = [
    "src/modules/auth/auth.routes.ts",
    "src/middleware/auth.ts",
    "src/utils/jwt.ts",
    "src/utils/password.ts",
  ];
  check("Исполняемые файлы регистрации, JWT и паролей удалены", authFiles.every((file) => !fs.existsSync(path.join(BACKEND, file))));
  const imageFiles = listFiles(path.join(ROOT, "frontend", "public"));
  const nonPngImages = imageFiles.filter((file) => /\.(svg|jpe?g|webp|gif|ico|avif|bmp)$/i.test(file));
  check("Во frontend/public нет SVG и других форматов изображений", nonPngImages.length === 0, nonPngImages.map((file) => path.relative(ROOT, file)).join(", "));

  const failures = checks.filter((row) => !row.passed);
  console.log(`\n──────── ИТОГ ────────\nуспешно: ${checks.length - failures.length} | ошибок: ${failures.length}`);
  for (const row of failures) console.log(`  ОШИБКА: ${row.name}`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
