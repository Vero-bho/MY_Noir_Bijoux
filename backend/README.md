# Backend Noir Bijoux

REST API на Express, TypeScript и Prisma. Основная СУБД — PostgreSQL в Supabase; API обслуживает каталог, компоненты конструктора, гостевые сборки, точки получения и создание заказов.

## Настройка

Создайте `backend/.env` на основе `.env.example` и укажите `DATABASE_URL` и `DIRECT_URL` Supabase. Не добавляйте `.env` в Git или архив. Для пустого проекта таблицы можно создать SQL-скриптом `sql-postgres/00_create_all_simple.sql`; Prisma-схема и миграция расположены в `src/prisma/`.

## Команды

| Команда | Назначение |
|---|---|
| `npm ci` | установка зависимостей |
| `npm run prisma:generate` | генерация Prisma Client |
| `npm run dev` | запуск API для разработки |
| `npm run build` | компиляция TypeScript |
| `npm start` | запуск production-сборки |
| `npm run seed` | очистка таблиц и загрузка начальных данных магазина |
| `npm test` | проверки SQL, публичного API и seed без Supabase |
| `npm run check:files` | проверка структуры проекта |

`npm run seed` удаляет текущие данные таблиц магазина. Используйте только если вы намеренно хотите заменить их.

## Docker

Корневой `docker-compose.yml` запускает frontend и API. Для запуска только API используйте `docker-compose.yml` в этой папке. Оба варианта требуют заполненный `backend/.env`; база данных по-прежнему подключается к Supabase.

Реальная связь с Supabase проверяется через `npm run db:check` после настройки `.env`.
