import { Router } from "express";

import * as productsController from "./products.controller";

const router = Router();

router.get("/products", productsController.list);
router.get("/products/:slug", productsController.getBySlug);

router.get("/categories", productsController.categories);
router.get("/materials", productsController.materials);

export default router;
