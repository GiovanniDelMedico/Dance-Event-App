import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { useMessages } from "../hooks/useMessages";
import { useAuth } from "../../../context/AuthContext";

import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../../../ui/ChatHeader";

import { http } from "../../../api/http";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = Number(id);

  const location = useLocation();
  const otherUserIdFromState = location.state?.otherUserId || null;

  const { user } = useAuth();
  const userId = user?.id;

  const { messages, loading } = useMessages(conversationId);

  const [otherUser, setOtherUser] = useState<any>(null);

  // 🔥 Se non ci sono messaggi → recupera l’altro utente dal backend
  useEffect(() => {
    async function loadOtherUser() {
      if (messages.length > 0) {
        // Se ci sono messaggi → prendi il sender diverso da me
        const u = messages.find((m) => m.sender.id !== userId)?.sender;
        if (u) setOtherUser(u);
        return;
      }

      // Se NON ci sono messaggi → usa l’ID passato dal navigate
      if (otherUserIdFromState) {
        const data = await http(`/users/${otherUserIdFromState}`);
        setOtherUser(data);
      }
    }

    loadOtherUser();
  }, [messages, userId, otherUserIdFromState]);

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

  // 🔥 Ora NON mostriamo più “conversazione non disponibile”
  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Caricamento chat...
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
