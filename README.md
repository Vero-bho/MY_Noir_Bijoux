# Noir Bijoux

Интернет-магазин украшений с каталогом, конструктором, корзиной и оформлением заказа. Репозиторий один: `frontend/` и `backend/`. Основная база — PostgreSQL в Supabase; локальная база данных в Docker не запускается.

## Страницы аккаунта

Маршруты `/login`, `/register` и `/profile/settings` сохранены. Реализация входа, регистрации, JWT и управления аккаунтом удалена: формы только показывают уведомление об отключённой функции и не отправляют данные. Заказ можно оформить без аккаунта; история и сохранённые сборки в браузере работают локально.

## Supabase

1. Создайте проект Supabase.
2. В пустом проекте откройте SQL Editor и один раз выполните `backend/sql-postgres/00_create_all_simple.sql`. Скрипт создаёт таблицы и начальные данные каталога.
3. Скопируйте `backend/.env.example` в `backend/.env` и укажите `DATABASE_URL` и `DIRECT_URL` из Supabase. `.env` содержит секреты: его нельзя отправлять или добавлять в Git/архив.

`backend/sql-postgres/03_seed.sql` очищает таблицы и повторно заполняет каталог. Запускайте его только если намеренно хотите заменить данные.

## Запуск в разработке

Backend, из `backend/`:

```powershell
Copy-Item .env.example .env
npm ci
npm run prisma:generate
npm run dev
```

Frontend, в отдельном окне PowerShell, из `frontend/`:

```powershell
npm ci
npm run dev
```

Сайт: `http://localhost:5173`. Проверка API: `http://localhost:4000/api/health`.

## Docker Compose

После заполнения `backend/.env` из корня проекта:

```powershell
docker compose up --build -d
docker compose ps
docker compose down
```

Compose запускает только frontend и backend; PostgreSQL остаётся в Supabase.

## Проверки

```powershell
cd backend
npm ci
npm run prisma:generate
npm run typecheck
npm test

cd ..\frontend
npm ci
npm run typecheck
npm run build
```

Backend-тесты используют тестовую in-memory базу и не подключаются к Supabase. Реальные подключения к Supabase и запуск Docker зависят от настроек пользователя.

## Изображения и размеры

Изображения проекта сохранены в PNG. Каталожные изображения демонстрационные, а не фотографии реальных товаров пользователя. Для браслетов доступны 16, 17 и 18 см; для колец — 16, 17, 18 и 19; длины колье — 35 см («чокер») и 60 см («матине»).
