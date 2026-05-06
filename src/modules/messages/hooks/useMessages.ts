import { useEffect, useState } from "react";
import { http } from "../../../api/http";
import type { Message } from "../types";

export function useMessages(conversationId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      const data = await http<Message[]>(`/messages/${conversationId}/messages`);
      setMessages(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Carica subito i messaggi
    loadMessages();

    // Polling ogni 2 secondi
    const interval = setInterval(() => {
      loadMessages();
    }, 1000);

    // Cleanup quando cambia conversazione o si smonta il componente
    return () => clearInterval(interval);
  }, [conversationId]);

  return { messages, loading };
}
