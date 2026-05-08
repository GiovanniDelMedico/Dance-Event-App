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
    if (!conversationId) return;

    let interval: number;

    function tick() {
      // Evita richieste inutili quando la tab non è attiva
      if (!document.hasFocus()) return;
      loadMessages();
    }

    // Carica subito
    tick();

    // Polling ogni 3 secondi
    interval = window.setInterval(tick, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  return { messages, loading };
}
