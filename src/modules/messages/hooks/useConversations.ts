import { useEffect, useState } from "react";
import { http } from "../../../api/http";
import type { Conversation } from "../types";
import { useAuth } from "../../../context/AuthContext";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAnyUnread, setHasAnyUnread] = useState(false);

  const { user } = useAuth();
  const currentUserId = user?.id;

  async function loadConversations() {
    try {
      const data = await http<Conversation[]>("/messages");

      // 🔥 Calcola hasUnread usando readAt
      const withUnread = data.map((c) => {
        const last = c.messages[0];

        const hasUnread =
          last &&
          last.sender.id !== currentUserId &&
          last.readAt === null; // 👈 ora usiamo readAt

        return { ...c, hasUnread };
      });

      // 🔥 Navbar: almeno un messaggio non letto?
      setHasAnyUnread(withUnread.some((c) => c.hasUnread));

      // 🔥 Ordina per ultimo messaggio
      const sorted = [...withUnread].sort((a, b) => {
        const aTime = a.messages[0]?.createdAt
          ? new Date(a.messages[0].createdAt).getTime()
          : 0;

        const bTime = b.messages[0]?.createdAt
          ? new Date(b.messages[0].createdAt).getTime()
          : 0;

        return bTime - aTime;
      });

      setConversations(sorted);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (!currentUserId) return; // 👈 BLOCCA TUTTO FINCHÉ NON SEI LOGGATO

  loadConversations();
  const interval = setInterval(loadConversations, 1000);
  return () => clearInterval(interval);
}, [currentUserId]);

  return { conversations, loading, hasAnyUnread };
}

