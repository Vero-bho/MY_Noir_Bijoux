import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";
import { buildArticle } from "../../utils/article";
import { toBuildDto } from "../../utils/mappers";
import { getComponentsByIds } from "../components/components.service";

const JEWELRY_TYPES = ["necklace", "bracelet", "earrings", "ring"];

export interface CreateBuildInput {
  jewelryType: string;
  componentIds: Array<number | string>;
}

export async function createBuild(input: CreateBuildInput) {
  if (!JEWELRY_TYPES.includes(input.jewelryType)) {
    throw new AppError(400, `Неизвестный тип изделия «${input.jewelryType}». Допустимо: ${JEWELRY_TYPES.join(", ")}`);
  }

  const uniqueIds = [...new Set(input.componentIds.map(Number))].filter((id) => Number.isInteger(id) && id > 0);

  if (uniqueIds.length === 0) {
    throw new AppError(400, "Выберите хотя бы один компонент");
  }

  const components = await getComponentsByIds(uniqueIds);
  const wrongType = components.filter((component) => component.jewelryType !== input.jewelryType);
  if (wrongType.length > 0) {
    throw new AppError(
      400,
      `Компоненты не подходят к типу изделия «${input.jewelryType}»: ${wrongType.map((component) => component.name).join(", ")}`,
    );
  }

  const totalPrice = components.reduce((sum, component) => sum + Number(component.price), 0);
  const build = await prisma.build.create({
    data: {
      userId: null,
      jewelryType: input.jewelryType,
      article: buildArticle(input.jewelryType, uniqueIds),
      totalPrice,
      items: {
        create: components.map((component) => ({
          componentId: component.id,
          layerZ: component.layerZ,
        })),
      },
    },
    include: { items: { include: { component: true } } },
  });

  return toBuildDto(build);
}

export async function getBuild(id: number) {
  const build = await prisma.build.findUnique({
    where: { id },
    include: { items: { include: { component: true } } },
  });

  if (!build || build.userId !== null) {
    throw new AppError(404, `Сборка с идентификатором ${id} не найдена`);
  }

  return toBuildDto(build);
}
