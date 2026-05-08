import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, MessageCircle, User, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../modules/messages/hooks/useConversations";
import Avatar from "../modules/users/Avatar"; // <-- IMPORT AGGIUNTO

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasAnyUnread } = useConversations();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        h-16
        bg-[var(--bg)]
        border-t border-[var(--gray-300)]
        flex justify-around items-center
        z-50
        md:hidden
      "
    >
      {/* HOME */}
      <NavItem
        to="/events"
        icon={<Home size={22} />}
        label="Home"
        active={location.pathname === "/events"}
      />

      {/* CREA EVENTO */}
      <NavItem
        to="/events/create"
        icon={<Calendar size={22} />}
        label="Crea"
        active={location.pathname === "/events/create"}
        hidden={!user}
      />

      {/* CHAT */}
      <NavItem
        to="/messages"
        icon={
          <div className="relative">
            <MessageCircle size={22} />
            {hasAnyUnread && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary-500)] rounded-full"></span>
            )}
          </div>
        }
        label="Chat"
        active={location.pathname.startsWith("/messages")}
        hidden={!user}
      />

      {/* PROFILO */}
      {user ? (
        <NavItem
          to="/profile"
          icon={
            <Avatar
              src={user.avatarUrl}
              alt={user.nickname}
              size={24}
            />
          }
          label="Profilo"
          active={location.pathname === "/profile"}
        />
      ) : (
        <NavItem
          to="/login"
          icon={<User size={22} />}
          label="Login"
          active={location.pathname === "/login"}
        />
      )}

      {/* OPZIONI */}
      {user && (
        <NavItem
          to="/options"
          icon={<Settings size={22} />}
          label="Opzioni"
          active={location.pathname === "/options"}
        />
      )}
    </nav>
  );
}

function NavItem({ to, icon, label, active, hidden }: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <Link to={to} className="flex flex-col items-center justify-center text-xs">
      <div
        className={`
          ${active ? "text-[var(--primary-500)]" : "text-[var(--gray-700)]"}
          transition
        `}
      >
        {icon}
      </div>
      <span
        className={`
          mt-1
          ${active ? "text-[var(--primary-500)]" : "text-[var(--gray-700)]"}
        `}
      >
        {label}
      </span>
    </Link>
  );
}
