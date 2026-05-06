import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { RegisterBody, LoginBody } from "./users.types";
import { AuthRequest } from "../../middleware/auth";

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

// POST /users/avatar
export async function uploadAvatar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await usersService.uploadAvatar(req.user!.id, req.file);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRegisteredEvents(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const events = await usersService.getRegisteredEvents(userId);
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel caricamento degli eventi iscritti" });
  }
}
