SET search_path = public;

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30),
    "avatarUrl" VARCHAR(400),
    "role" VARCHAR(20) NOT NULL DEFAULT 'client',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "slug" VARCHAR(60) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "materials" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" VARCHAR(400) NOT NULL,
    "description" VARCHAR(1000),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "jewelryType" VARCHAR(30) NOT NULL,
    "slot" VARCHAR(30) NOT NULL,
    "materialId" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" VARCHAR(400) NOT NULL,
    "layerZ" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "builds" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "jewelryType" VARCHAR(30) NOT NULL,
    "article" VARCHAR(50) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "builds_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "build_items" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "layerZ" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "build_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "orderNumber" VARCHAR(20) NOT NULL,
    "userId" INTEGER,
    "customerName" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(150),
    "deliveryType" VARCHAR(20) NOT NULL,
    "address" VARCHAR(400),
    "pickupPointId" INTEGER,
    "total" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'new',
    "comment" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER,
    "buildId" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "buildId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pickup_points" (
    "id" SERIAL NOT NULL,
    "kind" VARCHAR(20) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "address" VARCHAR(250) NOT NULL,
    "workHours" VARCHAR(120),
    "phone" VARCHAR(30),

    CONSTRAINT "pickup_points_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "room" VARCHAR(60) NOT NULL DEFAULT 'support',
    "body" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

CREATE INDEX "products_materialId_idx" ON "products"("materialId");

CREATE INDEX "components_jewelryType_slot_idx" ON "components"("jewelryType", "slot");

CREATE UNIQUE INDEX "builds_article_key" ON "builds"("article");

CREATE INDEX "builds_userId_idx" ON "builds"("userId");

CREATE INDEX "build_items_buildId_idx" ON "build_items"("buildId");

CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

CREATE INDEX "orders_userId_idx" ON "orders"("userId");

CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

CREATE INDEX "pickup_points_kind_city_idx" ON "pickup_points"("kind", "city");

CREATE INDEX "chat_messages_room_createdAt_idx" ON "chat_messages"("room", "createdAt");

ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "products" ADD CONSTRAINT "products_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "components" ADD CONSTRAINT "components_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "builds" ADD CONSTRAINT "builds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "build_items" ADD CONSTRAINT "build_items_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "build_items" ADD CONSTRAINT "build_items_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "components"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "builds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "builds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

SELECT table_name AS "Таблица"
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
