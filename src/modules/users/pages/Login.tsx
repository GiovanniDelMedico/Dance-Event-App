import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      toast.success("Accesso effettuato");
      navigate("/events");
    } catch {
      setError("Credenziali non valide");
      toast.error("Credenziali non valide");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      <div className="w-full max-w-md">

        {/* HEADER BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">
            Dance Events
          </h1>
          <p className="text-sm text-zinc-600">
            Accedi per scoprire le battle
          </p>
        </div>

        {/* CARD */}
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700">
                Email
              </label>

              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700">
                Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-600 font-medium bg-red-100 p-2 rounded-md">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button type="submit" variant="primary" className="w-full">
              Accedi
            </Button>
          </form>
        </Card>

        {/* FOOTER */}
        <p className="text-center text-xs text-zinc-600 mt-4">
          Nuovo qui?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-purple-600 font-medium hover:underline cursor-pointer"
          >
            Registrati
          </button>
        </p>

      </div>
    </div>
  );
}
