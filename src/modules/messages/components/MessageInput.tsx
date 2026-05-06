import { useState } from "react";
import Button from "../../../ui/Button";

interface Props {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
  className="
    fixed bottom-0 left-0 right-0
    flex items-center gap-2
    p-3
    border-t border-zinc-300
    bg-white
    z-50
  "
>
  <input
    className="
      flex-1 px-4 py-2 rounded-full
      text-sm outline-none
      bg-zinc-100
      text-zinc-900
      border border-zinc-300
      focus:ring-2 focus:ring-purple-300 focus:border-purple-500
      transition
    "
    placeholder="Scrivi un messaggio..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}
  />

  <Button onClick={handleSend} disabled={!text.trim()} className="px-5">
    Invia
  </Button>
</div>
  );
}
