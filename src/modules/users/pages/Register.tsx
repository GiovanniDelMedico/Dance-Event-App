import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await register({ name, nickname, email, password });

      toast.success("Registrazione completata");

      navigate("/");
    } catch {
      setError("Registrazione non valida");
      toast.error("Registrazione non valida");
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
            Crea un account per partecipare alle battle
          </p>
        </div>

        {/* CARD */}
        <Card className="p-6">

          <h2 className="text-xl font-semibold mb-4 text-zinc-900">
            Registrati
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700">
                Nome
              </label>
              <Input
                type="text"
                placeholder="Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* NICKNAME */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700">
                Nickname
              </label>
              <Input
                type="text"
                placeholder="mariorossi"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>

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
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-md">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <Button type="submit" variant="primary" className="w-full">
              Registrati
            </Button>
          </form>
        </Card>

        {/* FOOTER */}
        <p className="text-center text-xs text-zinc-600 mt-4">
          Hai già un account? Accedi per partecipare alle battle
        </p>

      </div>
    </div>
  );
}
