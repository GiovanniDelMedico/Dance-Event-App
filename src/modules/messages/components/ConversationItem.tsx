import type { Conversation } from "../types";

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
      {/* AVATAR */}
      {other.avatarUrl ? (
        <img
          src={other.avatarUrl}
          alt={other.nickname}
          className="w-10 h-10 rounded-full object-cover border border-zinc-300"
        />
      ) : (
        <div
          className="
            w-10 h-10 rounded-full
            bg-zinc-300
            flex items-center justify-center
            text-sm font-semibold text-zinc-700
          "
        >
          {other.nickname[0].toUpperCase()}
        </div>
      )}

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
