import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <Link to="/events" className="text-xl font-bold hover:text-gray-300">
          Dance Events
        </Link>

        <Link to="/events" className="hover:text-gray-300">
          Eventi
        </Link>

        {user && (
          <Link
            to="/events/create"
            className="hover:text-gray-300"
          >
            Crea evento
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Registrati
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              Ciao, <span className="font-semibold text-white">{user.name}</span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
