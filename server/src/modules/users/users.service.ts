import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { RegisterBody, LoginBody } from "./users.types";

// --------------------------------------------------
// REGISTER
// --------------------------------------------------
export async function register(body: RegisterBody) {
  const { email, password, name } = body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error("Email già registrata");
    err.status = 400;
    throw err;
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

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Registrazione completata",
    user,
    token,
  };
}

// --------------------------------------------------
// LOGIN
// --------------------------------------------------
export async function login(body: LoginBody) {
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("Credenziali non valide");
    err.status = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err: any = new Error("Credenziali non valide");
    err.status = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
}
