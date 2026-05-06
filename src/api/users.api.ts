import { http } from "./http";
import type { LoginBody, RegisterBody, AuthResponse } from "../modules/users/types";

export function loginUser(body: LoginBody) {
  return http<AuthResponse>("/users/login", {
    method: "POST",
    body, // ✔ oggetto, NON stringa
  });
}

export function registerUser(body: RegisterBody) {
  return http<AuthResponse>("/users/register", {
    method: "POST",
    body, // ✔ oggetto, NON stringa
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  return http<{ avatarUrl: string }>("/users/avatar", {
    method: "POST",
    body: formData, // ✔ FormData → http.ts NON imposta Content-Type
  });
}
