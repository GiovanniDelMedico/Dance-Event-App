import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { RegisterBody, LoginBody } from "./users.types";
import { AuthRequest } from "../../middleware/auth";

// --------------------------------------------------
// POST /users/register
// --------------------------------------------------
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

// --------------------------------------------------
// POST /users/login
// --------------------------------------------------
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

// --------------------------------------------------
// POST /users/avatar
// --------------------------------------------------
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

// --------------------------------------------------
// GET /users/:id  ← NECESSARIO PER LA CHAT
// --------------------------------------------------
export async function getUserById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const user = await usersService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// --------------------------------------------------
// GET /users/registered-events
// --------------------------------------------------
export async function getRegisteredEvents(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const events = await usersService.getRegisteredEvents(userId);
    res.json({ events });
  } catch (err) {
    next(err);
  }
}
