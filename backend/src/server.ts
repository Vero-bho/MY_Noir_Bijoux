import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, "0.0.0.0", () => {
  console.log(`Noir Bijoux API запущен на порту ${env.port}`);
  console.log(`Проверка: http://localhost:${env.port}/api/health`);
});
