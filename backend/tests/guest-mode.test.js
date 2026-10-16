"use strict";

process.env.NODE_ENV = "test";
process.env.PORT = "0";
process.env.DATABASE_URL = "postgresql://ci:ci@127.0.0.1:5432/noir_bijoux_test?schema=public";

const { createApp } = require("../dist/app.js");

async function main() {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const checks = [];

  try {
    const paths = [
      ["POST", "/api/auth/login"],
      ["POST", "/api/auth/register"],
      ["GET", "/api/profile"],
      ["GET", "/api/favorites"],
      ["GET", "/api/admin/orders"],
      ["GET", "/api/orders/my"],
      ["GET", "/api/builds/my"],
    ];

    for (const [method, path] of paths) {
      const response = await fetch(`${base}${path}`, { method });
      const passed = response.status === 404;
      checks.push(passed);
      console.log(`  ${passed ? "✔" : "✘"} ${method} ${path} отсутствует в API (HTTP ${response.status})`);
    }
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }

  const failures = checks.filter((passed) => !passed).length;
  console.log(`\n──────── ИТОГ ────────\nуспешно: ${checks.length - failures} | ошибок: ${failures}`);
  if (failures) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
