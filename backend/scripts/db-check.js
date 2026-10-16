"use strict";

const { prisma } = require("../dist/prisma/client.js");

const TABLES = [
  ["categories", "категории"],
  ["materials", "материалы"],
  ["products", "изделия каталога"],
  ["components", "компоненты конструктора"],
  ["pickup_points", "точки получения"],
  ["builds", "сборки"],
  ["orders", "заказы"],
];

async function main() {
  console.log("Проверка подключения к PostgreSQL в Supabase…\n");

  const info = await prisma.$queryRaw`
    SELECT version() AS version,
           current_database() AS "dbName",
           current_user AS "loginName"`;
  const server = await prisma.$queryRaw`
    SELECT COALESCE(inet_server_addr()::text, '—') AS host, inet_server_port() AS port`;

  const { version, dbName, loginName } = info[0];
  console.log(`Сервер: ${String(version).split(",")[0]}`);
  console.log(`База: ${dbName}`);
  console.log(`Роль подключения: ${loginName}`);
  console.log(`Адрес: ${server[0].host}:${server[0].port}\n`);
  console.log("Таблица                  строк");
  console.log("────────────────────────────────");

  let total = 0;
  for (const [table, title] of TABLES) {
    const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM "${table}"`);
    const count = Number(rows[0].count);
    total += count;
    console.log(`${table.padEnd(24)} ${String(count).padStart(5)}   (${title})`);
  }

  console.log("────────────────────────────────");
  console.log(`Всего строк в проверенных таблицах: ${total}\n`);
  console.log("Подключение работает. API можно запустить командой npm run dev.");
}

main()
  .catch((error) => {
    console.error("Не удалось подключиться к базе:");
    console.error(error.message);
    console.error("Проверьте интернет и DATABASE_URL в backend/.env.");
    console.error("Если таблицы ещё не созданы, выполните backend/sql-postgres/00_create_all_simple.sql в Supabase SQL Editor.");
    console.error("Для Prisma migrations DIRECT_URL должен указывать на Supabase Session pooler (обычно порт 5432).");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
