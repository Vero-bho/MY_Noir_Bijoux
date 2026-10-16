import { Router } from "express";

import { runValidation } from "../../middleware/validate";
import * as buildsController from "./builds.controller";
import { createBuildRules } from "./builds.validation";

const router = Router();

router.post("/", createBuildRules, runValidation, buildsController.create);
router.get("/:id", buildsController.getById);

export default router;
