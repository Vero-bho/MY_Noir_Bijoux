type AnyRecord = Record<string, any>;

const num = (value: unknown): number => Number(value ?? 0);

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

export function toProductDto(product: AnyRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    type: product.category?.name ?? null,
    typeSlug: product.category?.slug ?? null,
    material: product.material?.name ?? null,
    price: num(product.price),
    image: product.imageUrl,
    description: product.description ?? "",
    isActive: product.isActive,
  };
}

export function toComponentDto(component: AnyRecord) {
  return {
    id: component.id,
    name: component.name,
    jewelryType: component.jewelryType,
    slot: component.slot,
    price: num(component.price),
    image: component.imageUrl,
    layerZ: component.layerZ,
    material: component.material?.name ?? null,
  };
}

export function toBuildItemDto(item: AnyRecord) {
  return {
    id: item.id,
    componentId: item.componentId,
    name: item.component?.name ?? "",
    slot: item.component?.slot ?? "",
    price: num(item.component?.price),
    image: item.component?.imageUrl ?? null,
    layerZ: item.layerZ,
  };
}

export function toBuildDto(build: AnyRecord) {
  return {
    id: build.id,
    article: build.article,
    jewelryType: build.jewelryType,
    totalPrice: num(build.totalPrice),
    createdAt: toIso(build.createdAt),
    components: (build.items ?? []).map(toBuildItemDto),
  };
}

export function toDeliveryPointDto(point: AnyRecord) {
  return {
    id: point.id,
    kind: point.kind,
    provider: point.provider,
    city: point.city,
    address: point.address,
    workHours: point.workHours ?? "",
    phone: point.phone ?? null,
  };
}

export function toOrderDto(order: AnyRecord) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: toIso(order.createdAt),
    customerName: order.customerName,
    phone: order.phone,
    email: order.email ?? null,
    deliveryType: order.deliveryType,
    deliveryPointId: order.pickupPointId ?? null,
    address: order.address ?? null,
    comment: order.comment ?? null,
    total: num(order.total),
    status: order.status,
    items: (order.items ?? []).map((item: AnyRecord) => ({
      id: item.id,
      title: item.title,
      price: num(item.price),
      quantity: item.quantity,
      productId: item.productId ?? null,
      buildId: item.buildId ?? null,
    })),
  };
}
