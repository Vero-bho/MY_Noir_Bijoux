SET search_path = public;

TRUNCATE TABLE
    "order_items", "orders", "favorites", "build_items", "builds",
    "products", "components", "pickup_points", "chat_messages",
    "users", "categories", "materials"
RESTART IDENTITY CASCADE;

INSERT INTO "categories" ("id", "name", "slug") VALUES
    (1, 'Колье', 'necklace'),
    (2, 'Браслет', 'bracelet'),
    (3, 'Серьги', 'earrings'),
    (4, 'Кольцо', 'ring');
INSERT INTO "materials" ("id", "name") VALUES
    (1, 'Серебро 925'),
    (2, 'Ювелирный сплав'),
    (3, 'Чёрный родий');

INSERT INTO "products" ("id", "name", "slug", "categoryId", "materialId", "price", "imageUrl", "description", "isActive") VALUES
    (1, 'Браслет «Dark Star»', 'bracelet-dark-star', 2, 2, 3200, '/assets/catalog/bracelet-dark-star.png', 'Браслет из тёмных бусин с шармом-звездой. Доступны размеры 16, 17 и 18 см.', TRUE),
    (2, 'Браслет «Лилит»', 'bracelet-lilith', 2, 1, 3900, '/assets/catalog/bracelet-lilith.png', 'Жемчужный браслет с серебряным шармом. Доступны размеры 16, 17 и 18 см.', TRUE),
    (3, 'Серьги «Чёрная роза»', 'earrings-black-rose', 3, 3, 3400, '/assets/catalog/earrings-black-rose.png', 'Серьги с тёмными камнями и фурнитурой с покрытием чёрным родием.', TRUE),
    (4, 'Колье «Оникс капля»', 'necklace-onyx-drop', 1, 1, 5200, '/assets/catalog/necklace-onyx-drop.png', 'Колье с подвеской из чёрного оникса. Доступны длины 35 см — чокер и 60 см — матине.', TRUE),
    (5, 'Колье «Ночная Роза»', 'necklace-rose', 1, 1, 4500, '/assets/catalog/necklace-rose.png', 'Колье на цепочке с подвеской-розой. Доступны длины 35 см — чокер и 60 см — матине.', TRUE);

INSERT INTO "components" ("id", "name", "jewelryType", "slot", "materialId", "price", "imageUrl", "layerZ", "isActive") VALUES
    (1, 'Цепочка 1', 'necklace', 'chain', NULL, 1500, '/assets/components/necklace/chain-1.png', 1, TRUE),
    (2, 'Цепочка 2', 'necklace', 'chain', NULL, 900, '/assets/components/necklace/chain-2.png', 1, TRUE),
    (3, 'Подвеска «Роза»', 'necklace', 'pendant', NULL, 1200, '/assets/components/necklace/pendant-rose.png', 5, TRUE),
    (4, 'Подвеска «Оникс»', 'necklace', 'pendant', NULL, 1500, '/assets/components/necklace/pendant-onyx.png', 5, TRUE),
    (5, 'Подвеска «Крест»', 'necklace', 'pendant', NULL, 2000, '/assets/components/necklace/pendant-cross.png', 5, TRUE),
    (6, 'Карабин', 'necklace', 'clasp', NULL, 300, '/assets/components/necklace/clasp-bracelet.png', 8, TRUE),
    (7, 'Магнитная застёжка', 'necklace', 'clasp', NULL, 400, '/assets/components/necklace/clasp-magnetic.png', 8, TRUE),
    (8, 'Чокер', 'necklace', 'chain', NULL, 900, '/assets/components/necklace/choker.png', 1, TRUE),
    (9, 'Бусины из оникса', 'necklace', 'beads', NULL, 1100, '/assets/components/necklace/beads-onyx.png', 3, TRUE),
    (10, 'Подвеска «Him»', 'necklace', 'pendant', NULL, 1000, '/assets/components/necklace/pendant-him.png', 5, TRUE),
    (11, 'Подвеска «Lilith»', 'necklace', 'pendant', NULL, 1200, '/assets/components/necklace/pendant-lilith.png', 5, TRUE),
    (12, '35 см — чокер', 'necklace', 'length', NULL, 0, '', 0, TRUE),
    (13, '60 см — матине', 'necklace', 'length', NULL, 350, '', 0, TRUE),
    (14, 'Чёрные бусины', 'bracelet', 'beads', NULL, 1200, '/assets/components/bracelet/beads-black.png', 1, TRUE),
    (15, 'Бусины с цепочкой', 'bracelet', 'beads', NULL, 1300, '/assets/components/bracelet/beads-chain.png', 1, TRUE),
    (16, 'Светлые бусины', 'bracelet', 'beads', NULL, 1400, '/assets/components/bracelet/beads-white.png', 1, TRUE),
    (17, 'Шарм «Ангел»', 'bracelet', 'charm', NULL, 700, '/assets/components/bracelet/charm-angel.png', 6, TRUE),
    (18, 'Шарм «Крест»', 'bracelet', 'charm', NULL, 900, '/assets/components/bracelet/charm-cross.png', 6, TRUE),
    (19, 'Шарм «Him»', 'bracelet', 'charm', NULL, 800, '/assets/components/bracelet/charm-him.png', 6, TRUE),
    (20, 'Шарм «Lilith»', 'bracelet', 'charm', NULL, 800, '/assets/components/bracelet/charm-lilith.png', 6, TRUE),
    (21, 'Овальный шарм', 'bracelet', 'charm', NULL, 650, '/assets/components/bracelet/charm-oval.png', 6, TRUE),
    (22, 'Шарм «Звезда»', 'bracelet', 'charm', NULL, 700, '/assets/components/bracelet/charm-star.png', 6, TRUE),
    (23, 'Карабин', 'bracelet', 'clasp', NULL, 400, '/assets/components/bracelet/clasp-bracelet.png', 8, TRUE),
    (24, 'Застёжка-сердце', 'bracelet', 'clasp', NULL, 450, '/assets/components/bracelet/clasp-heart.png', 8, TRUE),
    (25, 'Магнитная застёжка', 'bracelet', 'clasp', NULL, 450, '/assets/components/bracelet/clasp-magnetic.png', 8, TRUE),
    (26, '16 см', 'bracelet', 'size', NULL, 0, '', 0, TRUE),
    (27, '17 см', 'bracelet', 'size', NULL, 0, '', 0, TRUE),
    (28, '18 см', 'bracelet', 'size', NULL, 100, '', 0, TRUE),
    (29, 'Английский замок', 'earrings', 'clasp', NULL, 900, '/assets/components/earrings/lock-english.png', 8, TRUE),
    (30, 'Пуссеты', 'earrings', 'clasp', NULL, 300, '/assets/components/earrings/lock-studs.png', 8, TRUE),
    (31, 'Камень «Чёрная роза»', 'earrings', 'stone', NULL, 1500, '/assets/components/earrings/stone-black-rose.png', 5, TRUE),
    (32, 'Камень «Крест»', 'earrings', 'stone', NULL, 900, '/assets/components/earrings/stone-cross.png', 5, TRUE),
    (33, 'Оникс', 'earrings', 'stone', NULL, 1000, '/assets/components/earrings/stone-onyx.png', 5, TRUE),
    (34, 'Жемчуг', 'earrings', 'stone', NULL, 1100, '/assets/components/earrings/stone-pearle.png', 5, TRUE),
    (35, 'Короткие (до 2 см)', 'earrings', 'length', NULL, 0, '', 0, TRUE),
    (36, 'Средние (3–4 см)', 'earrings', 'length', NULL, 150, '', 0, TRUE),
    (37, 'Длинные (5 см и более)', 'earrings', 'length', NULL, 300, '', 0, TRUE),
    (38, 'Профиль «Классика», золото', 'ring', 'profile', NULL, 2500, '/assets/components/ring/profile-classic-gold.png', 1, TRUE),
    (39, 'Профиль «Классика», серебро', 'ring', 'profile', NULL, 2300, '/assets/components/ring/profile-classic-silver.png', 1, TRUE),
    (40, 'Профиль «Плоский», золото', 'ring', 'profile', NULL, 2500, '/assets/components/ring/profile-flat-gold.png', 1, TRUE),
    (41, 'Профиль «Плоский», серебро', 'ring', 'profile', NULL, 2300, '/assets/components/ring/profile-flat-silver.png', 1, TRUE),
    (42, 'Оникс, золото', 'ring', 'stone', NULL, 1200, '/assets/components/ring/stone-onyx-gold.png', 6, TRUE),
    (43, 'Оникс, серебро', 'ring', 'stone', NULL, 1200, '/assets/components/ring/stone-onyx-silver.png', 6, TRUE),
    (44, 'Жемчуг', 'ring', 'stone', NULL, 1500, '/assets/components/ring/stone-pearl.png', 6, TRUE),
    (45, 'Размер 16', 'ring', 'size', NULL, 0, '', 0, TRUE),
    (46, 'Размер 17', 'ring', 'size', NULL, 0, '', 0, TRUE),
    (47, 'Размер 18', 'ring', 'size', NULL, 0, '', 0, TRUE),
    (48, 'Размер 19', 'ring', 'size', NULL, 0, '', 0, TRUE);

INSERT INTO "pickup_points" ("id", "kind", "provider", "city", "address", "workHours", "phone") VALUES
    (1, 'pickup', 'Мастерская Noir Bijoux', 'Новосибирск', 'ул. Дуси Ковальчук, 250, 2 этаж, офис 12', 'Пн–Пт 10:00–19:00, Сб 11:00–16:00', '+7 (383) 000-00-01'),
    (2, 'pickup', 'Шоурум «Aesthetics»', 'Новосибирск', 'Красный проспект, 100, 1 этаж', 'Ежедневно 10:00–20:00', '+7 (383) 000-00-02'),
    (3, 'pvz', 'ПВЗ СДЭК', 'Новосибирск', 'ул. Ленина, 12', 'Пн–Сб 10:00–20:00', NULL),
    (4, 'pvz', 'ПВЗ Boxberry', 'Новосибирск', 'ул. Гоголя, 15', 'Пн–Пт 09:00–19:00', NULL),
    (5, 'pvz', 'ПВЗ СДЭК', 'Бердск', 'ул. Первомайская, 8', 'Пн–Сб 10:00–19:00', NULL);

SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('materials', 'id'), (SELECT MAX(id) FROM materials));
SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('components', 'id'), (SELECT MAX(id) FROM components));
SELECT setval(pg_get_serial_sequence('pickup_points', 'id'), (SELECT MAX(id) FROM pickup_points));
