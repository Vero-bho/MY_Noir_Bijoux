import { useEffect, useState } from "react";

import { catalogProducts, getProductBySlug } from "~/data/catalog";
import { api } from "~/lib/api";
import type { CatalogProduct, JewelrySlug, JewelryType } from "~/types";

interface ProductListResponse {
  items?: Array<Partial<CatalogProduct>>;
}

function normalizeProduct(row: Partial<CatalogProduct>): CatalogProduct | null {
  if (!row.id || !row.slug || !row.image) return null;
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug),
    type: row.type as JewelryType,
    typeSlug: row.typeSlug as JewelrySlug,
    material: String(row.material ?? ""),
    price: Number(row.price ?? 0),
    image: String(row.image),
    description: String(row.description ?? ""),
  };
}

export function useCatalogProducts(): CatalogProduct[] {
  const [products, setProducts] = useState<CatalogProduct[]>(catalogProducts);

  useEffect(() => {
    let active = true;
    api
      .get<ProductListResponse>("/products")
      .then((response) => {
        const rows = (response.items ?? [])
          .map(normalizeProduct)
          .filter((row): row is CatalogProduct => row !== null);
        if (active && rows.length > 0) setProducts(rows);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return products;
}

export function useCatalogProduct(slug: string): CatalogProduct | undefined {
  const [product, setProduct] = useState<CatalogProduct | undefined>(() => getProductBySlug(slug));

  useEffect(() => {
    let active = true;
    setProduct(getProductBySlug(slug));

    if (!slug) return () => {
      active = false;
    };

    api
      .get<Partial<CatalogProduct>>(`/products/${encodeURIComponent(slug)}`)
      .then((row) => {
        const normalized = normalizeProduct(row);
        if (active && normalized) setProduct(normalized);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [slug]);

  return product;
}
