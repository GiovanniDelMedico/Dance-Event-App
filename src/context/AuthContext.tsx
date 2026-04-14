import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/users.api";
import type { User,LoginBody,RegisterBody,AuthResponse } from "../modules/users/types";
import { saveAuth, getToken, getUser, clearAuth } from "../utils/storage";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (body: LoginBody) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔥 Ripristina sessione da localStorage
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  // 🔥 LOGIN
  async function login(body: LoginBody) {
    const res: AuthResponse = await loginUser(body);

    setUser(res.user);
    setToken(res.token);

    saveAuth(res.token, res.user);
  }

  // 🔥 REGISTER
  async function register(body: RegisterBody) {
    const res: AuthResponse = await registerUser(body);

    setUser(res.user);
    setToken(res.token);

    saveAuth(res.token, res.user);
  }

  // 🔥 LOGOUT
  function logout() {
    setUser(null);
    setToken(null);
    clearAuth();
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
