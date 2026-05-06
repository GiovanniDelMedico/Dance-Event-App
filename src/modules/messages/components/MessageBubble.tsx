import type { Message } from "../types";

interface Props {
  message: Message;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: Props) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      
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
