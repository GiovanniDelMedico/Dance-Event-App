import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useMessages } from "../hooks/useMessages";
import { useAuth } from "../../../context/AuthContext";

import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../../../ui/ChatHeader";

import { http } from "../../../api/http";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = Number(id);

  const { user } = useAuth();
  const { messages, loading } = useMessages(conversationId);

  const userId = user?.id;

  // Trova l’altro utente
  const otherUser = useMemo(() => {
    if (!userId || messages.length === 0) return null;
    return messages.find((m) => m.sender.id !== userId)?.sender || null;
  }, [messages, userId]);

  // Marca come letti
  useEffect(() => {
    if (!conversationId || isNaN(conversationId)) return;

    http(`/messages/${conversationId}/read`, {
      method: "PATCH",
    });
  }, [conversationId]);

  async function send(content: string) {
    await http(`/messages/${conversationId}/messages`, {
      method: "POST",
      body: { content },
    });
  }

  // Loading
  if (loading || !userId) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Caricamento...
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Conversazione non disponibile
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white">

      {/* HEADER */}
      <ChatHeader
        nickname={otherUser.nickname}
        avatarUrl={otherUser.avatarUrl}
      />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isMine={m.sender.id === userId}
          />
        ))}
      </div>

      {/* INPUT */}
      <MessageInput onSend={send} />
    </div>
  );
}
