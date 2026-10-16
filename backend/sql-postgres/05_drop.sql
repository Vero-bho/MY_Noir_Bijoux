SET search_path = public;

DROP TABLE IF EXISTS
    "order_items",
    "orders",
    "favorites",
    "build_items",
    "builds",
    "products",
    "components",
    "pickup_points",
    "chat_messages",
    "users",
    "categories",
    "materials"
CASCADE;

SELECT COUNT(*) AS "Осталось таблиц"
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
