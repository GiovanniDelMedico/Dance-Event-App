import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../modules/messages/hooks/useConversations";
import Avatar from "../modules/users/Avatar"; // <-- IMPORT AGGIUNTO

export default function Navbar() {
  const { user, logout } = useAuth();
  const { hasAnyUnread } = useConversations();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-zinc-200 dark:border-zinc-800">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <Link to="/events" className="text-lg font-semibold">
          Dance Events
        </Link>

        <div className="hidden sm:flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link to="/events" className="hover:text-black dark:hover:text-white">
            Eventi
          </Link>

          {user && (
            <Link
              to="/events/create"
              className="hover:text-black dark:hover:text-white"
            >
              Crea
            </Link>
          )}

          {user && (
            <Link
              to="/messages"
              className="relative hover:text-black dark:hover:text-white"
            >
              Messaggi
              {hasAnyUnread && (
                <span className="absolute -top-1 -right-3 w-2 h-2 bg-purple-500 rounded-full"></span>
              )}
            </Link>
          )}

          {user && (
            <Link
              to="/options"
              className="hover:text-black dark:hover:text-white"
            >
              Opzioni
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm">
        {!user && (
          <>
            <Link
              to="/login"
              className="text-zinc-500 hover:text-black dark:hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-500 transition"
            >
              Registrati
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3">
            {/* AVATAR → PROFILO */}
            <Link to="/profile">
              <Avatar
                src={user.avatarUrl}
                alt={user.nickname}
                size={36}
              />
            </Link>

            {/* NAME */}
            <span className="hidden sm:block text-zinc-500 dark:text-zinc-400">
              {user.name}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-500 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
