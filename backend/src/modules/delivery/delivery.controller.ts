import type { NextFunction, Request, Response } from "express";

import * as deliveryService from "./delivery.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await deliveryService.listPoints(req.query.kind ? String(req.query.kind) : undefined));
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await deliveryService.getPoint(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}
