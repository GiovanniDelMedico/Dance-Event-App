import { useTheme } from "../../../ui/hooks/useTheme";
import { useAuth } from "../../../context/AuthContext";
import { Sun, Moon } from "lucide-react";

export default function OptionsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">

      {/* TITOLO */}
      <h1 className="text-2xl font-semibold text-zinc-900">
        Opzioni
      </h1>

      {/* CARD: TEMA */}
      <div
        className="
          bg-white
          border border-zinc-300
          rounded-xl p-4
          flex items-center justify-between
        "
      >
        <div>
          <p className="text-zinc-900 font-medium">
            Tema
          </p>

          <p className="text-sm text-zinc-600">
            Scegli tra modalità chiara e scura
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-full
            text-white
            bg-purple-600
            hover:bg-purple-500
            transition
          "
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* CARD: ACCOUNT */}
      <div
        className="
          bg-white
          border border-zinc-300
          rounded-xl p-4
        "
      >
        <p className="text-zinc-900 font-medium mb-3">
          Account
        </p>

        <button
          onClick={logout}
          className="
            w-full text-left
            text-sm px-4 py-2 rounded-lg
            border border-red-500 text-red-500
            hover:bg-red-500 hover:text-white
            transition
          "
        >
          Esci dall’account
        </button>
      </div>

      {/* FUTURE OPTIONS */}
      <div
        className="
          bg-white
          border border-zinc-300
          rounded-xl p-4 opacity-50
        "
      >
        <p className="text-zinc-900">
          Altre opzioni arriveranno presto…
        </p>
      </div>
    </div>
  );
}
