import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const APP = path.join(ROOT, "app");

const passed = [];
const failed = [];

function ok(title, details = "") {
  passed.push(title);
  console.log(`  ✔ ${title}${details ? ` — ${details}` : ""}`);
}

function bad(title, details = "") {
  failed.push(title);
  console.log(`  ✘ ${title}${details ? ` — ${details}` : ""}`);
}

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

console.log("Проверка структуры фронтенда Noir Bijoux\n");
console.log(`  папка проекта: ${ROOT}\n`);

const REQUIRED = [
  ["package.json", "список пакетов и команд"],
  ["vite.config.ts", "настройки сборки Vite"],
  ["react-router.config.ts", "настройки маршрутизации"],
  ["tsconfig.json", "настройки TypeScript"],
  ["app/root.tsx", "общий каркас сайта"],
  ["app/routes.ts", "список страниц"],
  ["app/app.css", "стили сайта"],
  ["app/data/catalog.ts", "данные каталога"],
  ["app/data/constructorComponents.ts", "данные конструктора"],
  ["app/data/delivery.ts", "способы доставки"],
  ["app/data/demoBuilds.ts", "локальные сохранённые сборки"],
  ["app/data/masterInfo.ts", "страница о мастере"],
  ["app/routes/login.tsx", "страница входа без авторизации"],
  ["app/routes/register.tsx", "страница регистрации без создания аккаунта"],
  ["app/routes/profile.settings.tsx", "настройки профиля без изменения аккаунта"],
  ["public", "статические файлы сайта"],
  ["public/favicon.png", "PNG-иконка сайта"],
  ["../.github/workflows/build.yml", "workflow монорепозитория"],
];

console.log("Основные файлы и папки");
for (const [relative, purpose] of REQUIRED) {
  const full = path.join(ROOT, relative);
  if (fs.existsSync(full)) ok(`${relative.padEnd(38)} ${purpose}`);
  else bad(`${relative.padEnd(38)} ${purpose}`, "нет файла или папки");
}

function resolves(importPath) {
  const base = path.join(APP, importPath);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.css`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

console.log('\nИмпорты "~/..."');
const sources = walk(APP).filter((file) => /\.(ts|tsx)$/.test(file));
const missingImports = new Map();
let importCount = 0;
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/from\s+["']~([^"']+)["']/g)) {
    importCount += 1;
    if (resolves(match[1])) continue;
    const target = `app${match[1]}`;
    const importer = path.relative(ROOT, file).replace(/\\/g, "/");
    if (!missingImports.has(target)) missingImports.set(target, importer);
  }
}
console.log(`  проверено файлов: ${sources.length}, импортов: ${importCount}`);
if (missingImports.size === 0) ok("все импорты проекта найдены");
else {
  for (const [target, importer] of missingImports) bad(target, `нужен файлу ${importer}`);
}

console.log("\nPNG-изображения сайта");
const imageSources = [
  path.join(APP, "data", "catalog.ts"),
  path.join(APP, "data", "constructorComponents.ts"),
  path.join(APP, "data", "masterInfo.ts"),
];
const imagePaths = new Set();
for (const file of imageSources) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/["'](\/assets\/[^"'\s]+\.png)["']/g)) imagePaths.add(match[1]);
}

let badImages = 0;
for (const publicPath of [...imagePaths].sort()) {
  const file = path.join(ROOT, "public", publicPath.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    bad(`public${publicPath}`, "PNG-файл не найден");
    badImages += 1;
    continue;
  }
  const signature = fs.readFileSync(file).subarray(0, 8);
  const isPng = signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!isPng) {
    bad(`public${publicPath}`, "файл по этому адресу не является PNG");
    badImages += 1;
  }
}
if (badImages === 0) ok("все ссылки на изображения ведут к существующим PNG", `${imagePaths.size} файлов`);

const publicFiles = walk(path.join(ROOT, "public"));
const nonPngImages = publicFiles.filter((file) => /\.(svg|jpe?g|webp|gif|ico|avif|bmp)$/i.test(file));
if (nonPngImages.length === 0) ok("все изображения в public сохранены только в PNG");
else for (const file of nonPngImages) bad(path.relative(ROOT, file), "удалите или замените на PNG");

const pngFiles = publicFiles.filter((file) => file.toLowerCase().endsWith(".png"));
console.log(`  PNG в public: ${pngFiles.length}; PNG-путей используются в данных: ${imagePaths.size}`);

console.log("\nСостояние проекта");
const hasModules = fs.existsSync(path.join(ROOT, "node_modules"));
if (hasModules) ok("node_modules", "пакеты установлены");
else bad("node_modules", "перейдите в frontend и выполните npm ci");

const hasEnv = fs.existsSync(path.join(ROOT, ".env"));
console.log(`  ${hasEnv ? "✔" : "—"} .env ${hasEnv ? "— задан локально" : "— необязателен для запуска frontend"}`);

console.log("\n──────── ИТОГ ────────");
console.log(`успешно: ${passed.length} | ошибок: ${failed.length}`);
if (failed.length > 0) {
  console.log("\nПроверьте отсутствующие файлы и PNG-пути выше.");
  process.exitCode = 1;
} else {
  console.log("\nВсё на месте. Запустите сайт командой npm run dev → http://localhost:5173");
}
