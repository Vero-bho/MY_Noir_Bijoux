"use strict";

const path = require("node:path");

process.env.NODE_ENV = "test";
process.env.PORT = "0";
process.env.DATABASE_URL = "postgresql://ci:ci@127.0.0.1:5432/noir_bijoux_test?schema=public";

const { createFakePrisma, seed } = require("./fake-prisma");
const fakePrisma = createFakePrisma();
seed(fakePrisma);

const clientPath = require.resolve(path.join(__dirname, "..", "dist", "prisma", "client.js"));
require.cache[clientPath] = {
  id: clientPath,
  filename: clientPath,
  loaded: true,
  exports: { prisma: fakePrisma },
  children: [],
  paths: [],
};

const { createApp } = require("../dist/app.js");
const results = [];

function check(name, passed, details = "") {
  results.push({ name, passed });
  console.log(`  ${passed ? "✔" : "✘"} ${name}${details ? ` — ${details}` : ""}`);
}

async function main() {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  const request = async (method, url, body) => {
    const response = await fetch(`${base}${url}`, {
      method,
      headers: body === undefined ? {} : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { status: response.status, body: data };
  };

  try {
    const health = await request("GET", "/api/health");
    check("Проверка сервера возвращает состояние API и базы", health.status === 200 && health.body.database === "connected");

    const catalog = await request("GET", "/api/products");
    check("Каталог возвращает 5 изделий", catalog.status === 200 && catalog.body.items.length === 5);
    check("Изображения каталога используют PNG", catalog.body.items.every((item) => item.image.endsWith(".png")));

    const necklaces = await request("GET", "/api/products?type=necklace");
    check("Фильтр категории находит 2 колье", necklaces.body.items.length === 2);

    const components = await request("GET", "/api/components?type=necklace");
    check("Конструктор отдаёт 13 компонентов колье", components.status === 200 && components.body.items.length === 13);

    const points = await request("GET", "/api/delivery/points");
    check("Доступны 5 точек получения", points.status === 200 && points.body.items.length === 5);

    const invalidBuild = await request("POST", "/api/builds", { jewelryType: "unknown", componentIds: [1] });
    check("Невалидная сборка отклоняется", invalidBuild.status === 400);

    const createdBuild = await request("POST", "/api/builds", {
      jewelryType: "necklace",
      componentIds: [1, 3, 6],
    });
    check("Гостевая сборка создаётся без аккаунта", createdBuild.status === 201 && createdBuild.body.totalPrice === 3000);

    const savedBuild = await request("GET", `/api/builds/${createdBuild.body.id}`);
    check("Гостевая сборка доступна по id", savedBuild.status === 200 && savedBuild.body.components.length === 3);

    const invalidOrder = await request("POST", "/api/orders", { items: [] });
    check("Пустой или некорректный заказ отклоняется", invalidOrder.status === 400);

    const createdOrder = await request("POST", "/api/orders", {
      customerName: "Тестовый покупатель",
      phone: "+7 (999) 000-00-00",
      deliveryType: "Самовывоз",
      deliveryPointId: 1,
      items: [{ productId: 1, quantity: 1 }],
    });
    check("Заказ можно оформить без аккаунта", createdOrder.status === 201 && createdOrder.body.status === "new");
    check("Цена заказа рассчитана по карточке изделия", createdOrder.body.total === 3200);

    const authRoute = await request("POST", "/api/auth/register", { email: "test@example.com", password: "unused" });
    check("Backend endpoint регистрации отсутствует", authRoute.status === 404);

    const profileRoute = await request("GET", "/api/profile");
    check("Backend endpoint профиля отсутствует", profileRoute.status === 404);

    const adminRoute = await request("GET", "/api/admin/orders");
    check("Backend endpoint администрирования отсутствует", adminRoute.status === 404);

    const missing = await request("GET", "/api/no-such-route");
    check("Неизвестный маршрут возвращает JSON 404", missing.status === 404 && Boolean(missing.body.message));
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }

  const failed = results.filter((result) => !result.passed);
  console.log(`\n──────── ИТОГ ────────\nуспешно: ${results.length - failed.length} | ошибок: ${failed.length}`);
  for (const result of failed) console.log(`  ОШИБКА: ${result.name}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Тест API завершился с ошибкой:", error);
  process.exitCode = 1;
});
