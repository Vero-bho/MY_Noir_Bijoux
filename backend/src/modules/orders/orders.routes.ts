import { Router } from "express";

import { runValidation } from "../../middleware/validate";
import * as ordersController from "./orders.controller";
import { createOrderRules } from "./orders.validation";

const router = Router();

router.post("/", createOrderRules, runValidation, ordersController.create);

export default router;
