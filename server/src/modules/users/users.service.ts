import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { RegisterBody, LoginBody } from "./users.types";
import { supabase } from "../../lib/supabase";

// --------------------------------------------------
// REGISTER
// --------------------------------------------------
export async function register(body: RegisterBody) {
  const { email, password, name, nickname } = body;

  // Email già registrata
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error("Email già registrata");
    err.status = 400;
    throw err;
  }

  // Nickname già usato
  const existingNick = await prisma.user.findUnique({ where: { nickname } });
  if (existingNick) {
    const err: any = new Error("Nickname già in uso");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      nickname,
      role: "user",
      avatarUrl: null, // 👈 IMPORTANTE
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl, // 👈 IMPORTANTE
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Registrazione completata",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: user.role,
      avatarUrl: user.avatarUrl, // 👈 IMPORTANTE
    },
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
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl, // 👈 AGGIUNTO
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: user.role,
      avatarUrl: user.avatarUrl, // 👈 AGGIUNTO
    },
  };
}

// --------------------------------------------------
// UPLOAD AVATAR
// --------------------------------------------------
export async function uploadAvatar(
  userId: number,
  file: Express.Multer.File | undefined
) {
  if (!file) {
    const err: any = new Error("Nessun file caricato");
    err.status = 400;
    throw err;
  }

  // Estensione del file
  const fileExt = file.originalname.split(".").pop();
  const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;

  // Upload su Supabase (bucket: avatars)
  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    const err: any = new Error("Errore upload avatar");
    err.status = 500;
    throw err;
  }

  // URL pubblica
  const publicUrl = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName).data.publicUrl;

  // Salva nel DB
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: publicUrl },
    select: { avatarUrl: true }, // 👈 IMPORTANTE
  });

  return updated; // { avatarUrl: "..." }
}


export async function getRegisteredEvents(userId: number) {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    include: {
      event: true,
    },
  });

  return registrations.map((r) => r.event);
}
