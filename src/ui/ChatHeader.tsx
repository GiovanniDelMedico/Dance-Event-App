import { useNavigate } from "react-router-dom";
import Avatar from "../modules/users/Avatar"; // <-- IMPORT CORRETTO

interface ChatHeaderProps {
  nickname: string;
  avatarUrl?: string | null;
  onBack?: () => void;
}

export default function ChatHeader({
  nickname,
  avatarUrl,
  onBack,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) onBack();
    else navigate("/messages");
  }

  return (
    <div
      className="
        flex items-center gap-3
        px-4 py-3
        border-b border-zinc-300
        bg-white
      "
    >

      {/* BACK */}
      <button
        onClick={handleBack}
        className="
          p-2 rounded-full
          hover:bg-zinc-100
          transition
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* AVATAR (nuovo componente con fallback lucide-react) */}
      <Avatar src={avatarUrl} alt={nickname} size={40} />

      {/* NICKNAME */}
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900">
          {nickname}
        </span>
      </div>
    </div>
  );
}
