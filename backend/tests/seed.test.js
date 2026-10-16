"use strict";

const path = require("node:path");

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://ci:ci@127.0.0.1:5432/noir_bijoux_test?schema=public";

const { createFakePrisma } = require("./fake-prisma");
const fakePrisma = createFakePrisma();
const clientPath = require.resolve(path.join(__dirname, "..", "dist", "prisma", "client.js"));

require.cache[clientPath] = {
  id: clientPath,
  filename: clientPath,
  loaded: true,
  exports: { prisma: fakePrisma },
  children: [],
  paths: [],
};

const checks = [];

function check(name, passed, details = "") {
  checks.push({ name, passed });
  console.log(`  ${passed ? "✔" : "✘"} ${name}${details ? ` — ${details}` : ""}`);
}

async function main() {
  const originalLog = console.log;
  console.log = () => {};
  require("../dist/prisma/seed.js");
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log = originalLog;

  const db = fakePrisma.__db;
  check("Заполнение базы завершилось без ошибки", process.exitCode !== 1);
  check("Добавлены 4 категории", db.category.length === 4);
  check("Добавлены 3 материала", db.material.length === 3);
  check("Добавлены 5 изделий каталога", db.product.length === 5);
  check("Добавлены 48 компонентов конструктора", db.component.length === 48);
  check("Добавлены 5 точек получения", db.pickupPoint.length === 5);
  check("Демо-аккаунты не создаются", db.user.length === 0);
  check("В базе нет избранного, привязанного к аккаунтам", db.favorite.length === 0);
  check("Заказы не создаются фиктивными демо-данными", db.order.length === 0);
  check("Сборки пользователей не создаются фиктивными демо-данными", db.build.length === 0);

  const product = db.product.find((row) => row.id === 1);
  check("Первое изделие — браслет Dark Star за 3200 ₽", product?.name === "Браслет «Dark Star»" && product?.price === 3200);
  check("У всех изображений товаров расширение PNG", db.product.every((row) => row.imageUrl.endsWith(".png")));
  check("Все визуальные компоненты конструктора используют PNG", db.component.every((row) => !row.imageUrl || row.imageUrl.endsWith(".png")));
  check("Браслеты представлены размерами 16, 17 и 18 см", [16, 17, 18].every((size) => db.component.some((row) => row.jewelryType === "bracelet" && row.name === `${size} см`)));
  check("Кольца представлены размерами 16, 17, 18 и 19", [16, 17, 18, 19].every((size) => db.component.some((row) => row.jewelryType === "ring" && row.name === `Размер ${size}`)));
  check("Колье представлены длинами 35 см — чокер и 60 см — матине", db.component.some((row) => row.name === "35 см — чокер") && db.component.some((row) => row.name === "60 см — матине"));

  const failures = checks.filter((row) => !row.passed);
  console.log(`\n──────── ИТОГ ────────\nуспешно: ${checks.length - failures.length} | ошибок: ${failures.length}`);
  for (const row of failures) console.log(`  ОШИБКА: ${row.name}`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
