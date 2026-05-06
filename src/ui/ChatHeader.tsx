import { useNavigate } from "react-router-dom";

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

      {/* AVATAR */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={nickname}
          className="
            w-10 h-10 rounded-full object-cover
            border border-zinc-300
          "
        />
      ) : (
        <div
          className="
            w-10 h-10 rounded-full
            bg-zinc-300
            flex items-center justify-center
            text-sm font-semibold
            text-zinc-700
          "
        >
          {nickname?.[0]?.toUpperCase()}
        </div>
      )}

      {/* NICKNAME */}
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900">
          {nickname}
        </span>
      </div>
    </div>
  );
}
