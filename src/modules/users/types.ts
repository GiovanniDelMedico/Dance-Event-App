export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  nickname: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  nickname: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
