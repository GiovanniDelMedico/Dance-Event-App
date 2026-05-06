import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getRegistrations } from "../../../api/events.api";
import { useAuth } from "../../../context/AuthContext";

import Card from "../../../ui/Card";
import Button from "../../../ui/Button";
import Spinner from "../../../ui/Spinner";
import toast from "react-hot-toast";

import { http } from "../../../api/http";
import type { ConversationCreated } from "../../messages/types";

export default function EventRegistrations() {
  const { id } = useParams();
  const eventId = Number(id);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD REGISTRATIONS
  useEffect(() => {
    async function load() {
      if (!token || !user) return;

      try {
        const result = await getRegistrations(eventId, token);
        setRegistrations(result.registrations);
      } catch {
        toast.error("Errore nel caricamento degli iscritti");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId, token, user]);

  // CHAT
  async function handleMessageUser(participantId: number) {
    try {
      const conversation = await http<ConversationCreated>(`/messages`, {
        method: "POST",
        body: {
          participantId,
          eventId,
        },
      });

      navigate(`/messages/${conversation.id}`);
    } catch {
      toast.error("Errore nell'apertura della chat");
    }
  }

  if (loading) return <Spinner />;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">
        Iscritti
      </h2>

      {registrations.length === 0 ? (
        <p className="text-zinc-600 text-sm">Nessun iscritto</p>
      ) : (
        <ul className="space-y-3">
          {registrations.map((r) => (
            <li
              key={r.id}
              className="
                p-4 rounded-lg border border-zinc-200
                bg-zinc-50 flex justify-between items-center
              "
            >
              <div>
                <p className="font-medium text-zinc-900">{r.user.name}</p>
                <p className="text-xs text-zinc-600">{r.user.email}</p>
              </div>

              <Button
                variant="primary"
                onClick={() => handleMessageUser(r.userId)}
              >
                Messaggia
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
