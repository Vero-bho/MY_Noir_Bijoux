import type { NextFunction, Request, Response } from "express";

import * as buildsService from "./builds.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const build = await buildsService.createBuild({
      jewelryType: req.body.jewelryType,
      componentIds: req.body.componentIds,
    });
    res.status(201).json(build);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(404).json({ message: `Сборка с идентификатором ${req.params.id} не найдена` });
    return;
  }

  try {
    res.json(await buildsService.getBuild(id));
  } catch (error) {
    next(error);
  }
}
