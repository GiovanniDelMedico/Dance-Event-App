import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { RegisterBody, LoginBody } from "./users.types";

// POST /users/register
export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await usersService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /users/login
export async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await usersService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
