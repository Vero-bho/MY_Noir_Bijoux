import { useCallback, useMemo, useState } from "react";

import type { CatalogProduct, JewelryType } from "~/types";
import { productMaterials } from "~/data/catalog";

export type SortValue = "popular" | "price-asc" | "price-desc" | "name";

export const PRICE_MAX = 6000;

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "Сначала дешёвые" },
  { value: "price-desc", label: "Сначала дорогие" },
  { value: "name", label: "По названию" },
];

export function useFilters(products: CatalogProduct[]) {
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [sort, setSort] = useState<SortValue>("popular");

  const toggleType = useCallback((type: JewelryType) => {
    setTypes((prev) => (prev.includes(type) ? prev.filter((row) => row !== type) : [...prev, type]));
  }, []);

  const toggleMaterial = useCallback((material: string) => {
    setMaterials((prev) =>
      prev.includes(material) ? prev.filter((row) => row !== material) : [...prev, material],
    );
  }, []);

  const reset = useCallback(() => {
    setTypes([]);
    setMaterials([]);
    setMaxPrice(PRICE_MAX);
    setSort("popular");
  }, []);

  const hasActiveFilters = types.length > 0 || materials.length > 0 || maxPrice < PRICE_MAX;

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const byType = types.length === 0 || types.includes(product.type);
      const byMaterial = materials.length === 0 || materials.includes(product.material);
      const byPrice = product.price <= maxPrice;
      return byType && byMaterial && byPrice;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name, "ru");
        default:
          return a.id - b.id;
      }
    });
  }, [products, types, materials, maxPrice, sort]);

  return {
    types,
    materials,
    maxPrice,
    sort,
    setSort,
    setMaxPrice,
    toggleType,
    toggleMaterial,
    reset,
    hasActiveFilters,
    filtered,
    availableMaterials: productMaterials,
  };
}
