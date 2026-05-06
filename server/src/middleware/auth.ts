import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  // 🔍 LOG DIAGNOSTICO — ci dice se il token arriva davvero
  console.log("AUTH HEADER:", req.headers.authorization);

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token mancante" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token non valido" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;

    // 🔍 LOG DIAGNOSTICO — ci dice cosa contiene il token
    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error);
    return res.status(401).json({ message: "Token non valido" });
  }
}
