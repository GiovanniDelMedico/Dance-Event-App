import type { Conversation } from "../types";
import Avatar from "../../users/Avatar"; // <-- IMPORT CORRETTO

interface Props {
  conversation: Conversation;
  currentUserId: number;
  onClick: () => void;
}

function ConversationItem({ conversation, currentUserId, onClick }: Props) {
  const last = conversation.messages[0];

  // Determina l'altro utente
  const other =
    conversation.creator.id === currentUserId
      ? conversation.participant
      : conversation.creator;

  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3
        p-3 border-b border-zinc-300
        cursor-pointer
        hover:bg-zinc-100
        transition
      "
    >
      {/* AVATAR (nuovo componente con fallback lucide-react) */}
      <Avatar src={other.avatarUrl} alt={other.nickname} size={40} />

      {/* Nome + ultimo messaggio */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-zinc-900 truncate">
          {other.nickname}
        </div>

        <div className="text-sm text-zinc-600 truncate">
          {last?.content ?? "Nessun messaggio"}
        </div>
      </div>

      {/* Punto unread */}
      {conversation.hasUnread && (
        <div className="w-3 h-3 bg-purple-500 rounded-full" />
      )}
    </div>
  );
}

export default ConversationItem;
