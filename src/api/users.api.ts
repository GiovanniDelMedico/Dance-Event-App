import { http } from "./http";
import type { LoginBody,RegisterBody,AuthResponse } from "../modules/users/types";

export function loginUser(body: LoginBody) {
  return http<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function registerUser(body: RegisterBody) {
  return http<AuthResponse>("/users/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
