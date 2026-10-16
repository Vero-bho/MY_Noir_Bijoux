SET search_path = public;

CREATE INDEX IF NOT EXISTS ix_products_active_price ON products (isActive, price);

CREATE INDEX IF NOT EXISTS ix_components_material ON components (materialId);

CREATE INDEX IF NOT EXISTS ix_build_items_component ON build_items (componentId);

CREATE INDEX IF NOT EXISTS ix_orders_status ON orders (status);

CREATE INDEX IF NOT EXISTS ix_order_items_product ON order_items (productId);
CREATE INDEX IF NOT EXISTS ix_order_items_build ON order_items (buildId);

CREATE INDEX IF NOT EXISTS ix_favorites_build ON favorites (buildId);

SELECT tablename AS "Таблица", indexname AS "Индекс"
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
