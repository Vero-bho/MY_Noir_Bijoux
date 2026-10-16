import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";
import { toComponentDto } from "../../utils/mappers";

export interface ComponentFilters {
  type?: string;
  slot?: string;
}

export async function listComponents(filters: ComponentFilters) {
  const where: Record<string, unknown> = { isActive: true };
  if (filters.type) where.jewelryType = filters.type;
  if (filters.slot) where.slot = filters.slot;

  const components = await prisma.component.findMany({
    where,
    include: { material: true },
    orderBy: [{ jewelryType: "asc" }, { slot: "asc" }, { layerZ: "asc" }, { id: "asc" }],
  });

  return { items: components.map(toComponentDto), total: components.length };
}

export async function getComponentById(id: number) {
  const component = await prisma.component.findUnique({ where: { id }, include: { material: true } });
  if (!component) throw new AppError(404, `Компонент с идентификатором ${id} не найден`);
  return toComponentDto(component);
}

export async function getComponentsByIds(ids: number[]) {
  const components = await prisma.component.findMany({ where: { id: { in: ids }, isActive: true } });

  if (components.length !== ids.length) {
    const foundIds = components.map((component) => component.id);
    const missing = ids.filter((id) => !foundIds.includes(id));
    throw new AppError(400, `Компоненты не найдены: ${missing.join(", ")}`);
  }

  return components;
}
