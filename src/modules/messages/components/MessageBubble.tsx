import type { Message } from "../types";
import Avatar from "../../users/Avatar";

interface Props {
  message: Message;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: Props) {
  return (
    <div
      className={`flex items-end gap-2 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar SOLO per messaggi non miei */}
      {!isMine && (
        <Avatar
          src={message.sender.avatarUrl}
          alt={message.sender.nickname}
          size={32}
        />
      )}

      {/* Bolla */}
      <div
        className={`
          px-4 py-2
          max-w-[75%]
          text-sm
          break-words
          rounded-2xl
          leading-relaxed
          shadow-sm
          transition

          ${
            isMine
              ? "bg-purple-600 text-white rounded-br-md"
              : "bg-zinc-200 text-zinc-900 rounded-bl-md"
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
