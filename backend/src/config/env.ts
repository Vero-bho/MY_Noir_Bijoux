import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Не задана переменная окружения ${name}. Проверьте файл .env.example`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
  nodeEnv: process.env.NODE_ENV ?? "development",
};
