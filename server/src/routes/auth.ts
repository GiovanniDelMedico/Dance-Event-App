import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import type { RegisterBody } from "../types/api";
import type { LoginBody } from "../types/api";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "../middleware/auth";


const router = Router();

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Email già registrata" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "user",
        },
      });

      //TOKEN
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );

      res
        .status(201)
        .json({ message: "Registrazione completata", user, token });
    } catch (error) {
      console.error("ERRORE REGISTRAZIONE:", error);
      res.status(500).json({ error: "Errore nella registrazione" });
    }
  },
);

router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
      const { email, password } = req.body;

      // 1. Cerco l'utente nel DB
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Credenziali non valide" });
      }

      // 2. Verifico la password
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(400).json({ error: "Credenziali non valide" });
      }

      // 3. Genero il token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );

      // 4. Rispondo con token + dati utente
      res.json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel login" });
    }
  },
);




export default router;
