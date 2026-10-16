import type { NextFunction, Request, Response } from "express";

import * as ordersService from "./orders.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await ordersService.createOrder(req.body));
  } catch (error) {
    next(error);
  }
}
