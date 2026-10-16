"use strict";

const RELATIONS = {
  user: {
    builds: { model: "build", many: true, foreignKey: "userId" },
    orders: { model: "order", many: true, foreignKey: "userId" },
    favorites: { model: "favorite", many: true, foreignKey: "userId" },
  },
  category: { products: { model: "product", many: true, foreignKey: "categoryId" } },
  material: {
    products: { model: "product", many: true, foreignKey: "materialId" },
    components: { model: "component", many: true, foreignKey: "materialId" },
  },
  product: {
    category: { model: "category", many: false, foreignKey: "categoryId" },
    material: { model: "material", many: false, foreignKey: "materialId" },
    orderItems: { model: "orderItem", many: true, foreignKey: "productId" },
  },
  component: {
    material: { model: "material", many: false, foreignKey: "materialId" },
    buildItems: { model: "buildItem", many: true, foreignKey: "componentId" },
  },
  build: {
    user: { model: "user", many: false, foreignKey: "userId" },
    items: { model: "buildItem", many: true, foreignKey: "buildId" },
    favorites: { model: "favorite", many: true, foreignKey: "buildId" },
  },
  buildItem: {
    build: { model: "build", many: false, foreignKey: "buildId" },
    component: { model: "component", many: false, foreignKey: "componentId" },
  },
  order: {
    user: { model: "user", many: false, foreignKey: "userId" },
    items: { model: "orderItem", many: true, foreignKey: "orderId" },
  },
  orderItem: {
    order: { model: "order", many: false, foreignKey: "orderId" },
    product: { model: "product", many: false, foreignKey: "productId" },
    build: { model: "build", many: false, foreignKey: "buildId" },
  },
  favorite: {
    user: { model: "user", many: false, foreignKey: "userId" },
    build: { model: "build", many: false, foreignKey: "buildId" },
  },
  pickupPoint: {},
  chatMessage: {},
};

const DEFAULTS = {
  user: {},
  product: { isActive: true, description: null },
  component: { isActive: true, materialId: null, layerZ: 1 },
  build: { userId: null },
  buildItem: { layerZ: 1 },
  order: { userId: null, status: "new", email: null, address: null, comment: null, pickupPointId: null },
  favorite: {},
  category: {},
  material: {},
  pickupPoint: { phone: null, workHours: null },
  chatMessage: {},
};

const TABLES = Object.keys(RELATIONS);

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function matchScalar(actual, condition) {
  if (condition === null) return actual === null || actual === undefined;
  if (typeof condition !== "object" || condition instanceof Date) return actual === condition;

  return Object.entries(condition).every(([operator, expected]) => {
    switch (operator) {
      case "equals":
        return matchScalar(actual, expected);
      case "not":
        return !matchScalar(actual, expected);
      case "in":
        return toArray(expected).some((value) => value === actual);
      case "notIn":
        return !toArray(expected).some((value) => value === actual);
      case "lt":
        return Number(actual) < Number(expected);
      case "lte":
        return Number(actual) <= Number(expected);
      case "gt":
        return Number(actual) > Number(expected);
      case "gte":
        return Number(actual) >= Number(expected);
      case "contains":

        return String(actual ?? "").toLowerCase().includes(String(expected).toLowerCase());
      case "startsWith":
        return String(actual ?? "").toLowerCase().startsWith(String(expected).toLowerCase());
      case "endsWith":
        return String(actual ?? "").toLowerCase().endsWith(String(expected).toLowerCase());
      case "mode":
        return true;
      default:
        return true;
    }
  });
}

function createQueryEngine(tables) {
  function match(record, where, model) {
    if (!where) return true;

    return Object.entries(where).every(([key, condition]) => {
      if (key === "AND") return toArray(condition).every((part) => match(record, part, model));
      if (key === "OR") return toArray(condition).some((part) => match(record, part, model));
      if (key === "NOT") return !toArray(condition).every((part) => match(record, part, model));

      const relation = RELATIONS[model]?.[key];

      if (relation) {

        const nested = condition?.is ?? condition?.some ?? condition;

        if (relation.many) {
          const children = tables[relation.model].filter((child) => child[relation.foreignKey] === record.id);
          return children.some((child) => match(child, nested, relation.model));
        }

        const parent = tables[relation.model].find((row) => row.id === record[relation.foreignKey]);
        return parent ? match(parent, nested, relation.model) : false;
      }

      return matchScalar(record[key], condition);
    });
  }

  function sort(rows, orderBy) {
    if (!orderBy) return rows;

    const clauses = toArray(orderBy);
    return [...rows].sort((a, b) => {
      for (const clause of clauses) {
        const [field, direction] = Object.entries(clause)[0];
        const left = a[field];
        const right = b[field];
        if (left === right) continue;

        const factor = String(direction).toLowerCase() === "desc" ? -1 : 1;
        const compare =
          typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left ?? "").localeCompare(String(right ?? ""));
        return compare * factor;
      }
      return 0;
    });
  }

  function includeRelations(record, include, model) {
    if (!include || !record) return record;

    const result = { ...record };

    for (const [key, value] of Object.entries(include)) {
      const relation = RELATIONS[model]?.[key];
      if (!relation) continue;

      if (relation.many) {
        const children = tables[relation.model].filter((child) => child[relation.foreignKey] === record.id);
        result[key] = children.map((child) =>
          includeRelations(child, value && typeof value === "object" ? value.include : null, relation.model),
        );
      } else {
        const parent = tables[relation.model].find((row) => row.id === record[relation.foreignKey]) ?? null;
        result[key] = parent
          ? includeRelations(parent, value && typeof value === "object" ? value.include : null, relation.model)
          : null;
      }
    }

    return result;
  }

  return { match, sort, includeRelations };
}

function createFakePrisma() {
  const tables = {};
  for (const name of TABLES) tables[name] = [];

  const nextId = {};
  for (const name of TABLES) nextId[name] = 1;

  const query = createQueryEngine(tables);

  function allocateId(model, requested) {
    if (requested !== undefined) return requested;

    let candidate = nextId[model];
    while (tables[model].some((row) => row.id === candidate)) candidate += 1;
    nextId[model] = candidate + 1;
    return candidate;
  }

  function createRecord(model, data) {
    const defaults = DEFAULTS[model] ?? {};
    const record = { ...defaults, ...data, id: allocateId(model, data.id) };

    if (model !== "category" && model !== "material" && model !== "pickupPoint" && model !== "chatMessage") {
      record.createdAt = data.createdAt ?? new Date();
    }

    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && !Array.isArray(value) && value.create) {
        delete record[key];
      }
    }

    tables[model].push(record);

    for (const [key, value] of Object.entries(data)) {
      if (!value || typeof value !== "object" || !value.create) continue;

      const relation = RELATIONS[model]?.[key];
      if (!relation) continue;

      for (const childData of toArray(value.create)) {
        createRecord(relation.model, { ...childData, [relation.foreignKey]: record.id });
      }
    }

    return record;
  }

  function findManyRows(model, args) {
    const rows = tables[model].filter((row) => query.match(row, args.where, model));
    const sorted = query.sort(rows, args.orderBy ?? { id: "asc" });
    const skipped = args.skip ? sorted.slice(args.skip) : sorted;
    const limited = args.take ? skipped.slice(0, args.take) : skipped;
    return limited.map((row) => query.includeRelations(row, args.include, model));
  }

  function makeModel(model) {
    const uniqueKeys = ["id", "slug", "orderNumber", "article"];

    return {
      findMany: async (args = {}) => findManyRows(model, args),

      findFirst: async (args = {}) => {
        const rows = findManyRows(model, { ...args, take: 1 });
        return rows[0] ?? null;
      },

      findUnique: async (args = {}) => {
        const where = args.where ?? {};
        const row = tables[model].find((candidate) =>
          uniqueKeys.some((key) => where[key] !== undefined && candidate[key] === where[key]),
        );
        if (!row) return null;
        return query.includeRelations(row, args.include, model);
      },

      count: async (args = {}) => tables[model].filter((row) => query.match(row, args.where, model)).length,

      deleteMany: async (args = {}) => {
        const keep = tables[model].filter((row) => !query.match(row, args.where, model));
        const removed = tables[model].length - keep.length;
        tables[model] = keep;
        return { count: removed };
      },

      createMany: async (args = {}) => {
        for (const row of toArray(args.data ?? [])) createRecord(model, row);
        return { count: toArray(args.data ?? []).length };
      },

      create: async (args = {}) => {
        const record = createRecord(model, args.data ?? {});
        return query.includeRelations(record, args.include, model);
      },

      update: async (args = {}) => {
        const where = args.where ?? {};
        const row = tables[model].find((candidate) =>
          uniqueKeys.some((key) => where[key] !== undefined && candidate[key] === where[key]),
        );
        if (!row) {
          const error = new Error(`Запись ${model} не найдена (тестовая заглушка Prisma)`);
          error.code = "P2025";
          throw error;
        }

        Object.assign(row, args.data ?? {});
        return query.includeRelations(row, args.include, model);
      },

      delete: async (args = {}) => {
        const where = args.where ?? {};
        const index = tables[model].findIndex((candidate) =>
          uniqueKeys.some((key) => where[key] !== undefined && candidate[key] === where[key]),
        );
        if (index === -1) {
          const error = new Error(`Запись ${model} не найдена (тестовая заглушка Prisma)`);
          error.code = "P2025";
          throw error;
        }

        const [removed] = tables[model].splice(index, 1);

        for (const [name, relations] of Object.entries(RELATIONS)) {
          for (const [key, relation] of Object.entries(relations)) {
            if (relation.model === model && relation.many) {
              tables[name] = tables[name].filter((child) => child[relation.foreignKey] !== removed.id);
            }
          }
        }

        return removed;
      },
    };
  }

  const prisma = {};

  for (const model of TABLES) {
    prisma[model] = makeModel(model);
  }

  prisma.$queryRaw = async () => [{ ok: 1 }];
  prisma.$connect = async () => undefined;
  prisma.$disconnect = async () => undefined;

  prisma.__db = tables;

  return prisma;
}

const STORE_DATA = require("./fixtures/store-data.json");

function seed(prisma) {
  const db = prisma.__db;
  db.category.push(...STORE_DATA.categories.map((row) => ({ ...row })));
  db.material.push(...STORE_DATA.materials.map((row) => ({ ...row })));
  db.product.push(...STORE_DATA.products.map((row) => ({ ...row, createdAt: new Date(row.createdAt) })));
  db.component.push(...STORE_DATA.components.map((row) => ({ ...row })));
  db.pickupPoint.push(...STORE_DATA.pickupPoints.map((row) => ({ ...row })));
}

module.exports = { createFakePrisma, seed };
