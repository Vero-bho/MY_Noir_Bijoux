import type { NextFunction, Request, Response } from "express";

import * as componentsService from "./components.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(
      await componentsService.listComponents({
        type: req.query.type ? String(req.query.type) : undefined,
        slot: req.query.slot ? String(req.query.slot) : undefined,
      }),
    );
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await componentsService.getComponentById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}
