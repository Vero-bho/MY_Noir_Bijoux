import type { NextFunction, Request, Response } from "express";

import * as productsService from "./products.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query;

    const result = await productsService.listProducts({
      type: query.type ? String(query.type) : undefined,
      material: query.material ? String(query.material) : undefined,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      search: query.search ? String(query.search) : undefined,
      sort: query.sort as never,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await productsService.getProductBySlug(String(req.params.slug)));
  } catch (error) {
    next(error);
  }
}

export async function categories(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ items: await productsService.listCategories() });
  } catch (error) {
    next(error);
  }
}

export async function materials(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ items: await productsService.listMaterials() });
  } catch (error) {
    next(error);
  }
}
