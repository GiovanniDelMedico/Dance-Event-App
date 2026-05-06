import { useAuth } from "../../../context/AuthContext";
import { useConversations } from "../hooks/useConversations";
import ConversationItem from "../components/ConversationItem";
import { useNavigate } from "react-router-dom";

export default function MessagesList() {
  const { user } = useAuth();
  const { conversations, loading } = useConversations();
  const navigate = useNavigate();

  const userId = user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Caricamento...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6 text-zinc-500">
        <p className="text-lg font-medium">Nessuna conversazione</p>
        <p className="text-sm mt-1">
          Quando contatterai qualcuno dagli eventi, apparirà qui
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-zinc-300">
        <h1 className="text-lg font-semibold text-zinc-900">
          Messaggi
        </h1>
        <p className="text-xs text-zinc-600">Le tue conversazioni</p>
      </div>

      {/* LIST */}
      <div className="flex flex-col divide-y divide-zinc-200">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/messages/${c.id}`)}
            className="
              cursor-pointer
              hover:bg-zinc-100
              transition
            "
          >
            <ConversationItem
              conversation={c}
              currentUserId={userId!}
              onClick={() => navigate(`/messages/${c.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
