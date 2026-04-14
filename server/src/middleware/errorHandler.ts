import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 ERRORE:", err);

  const status = err.status || 500;
  const message = err.message || "Errore interno del server";

  res.status(status).json({ message });
}
