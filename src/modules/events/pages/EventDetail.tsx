import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  getEventById,
  registerToEvent,
  unregisterFromEvent,
  checkIsRegistered,
  getRegistrations,
  deleteEvent,
} from "../../../api/events.api";

import type { Event } from "../types";
import type { ConversationCreated } from "../../messages/types";
import { useAuth } from "../../../context/AuthContext";

import Button from "../../../ui/Button";
import Badge from "../../../ui/Badge";
import Card from "../../../ui/Card";
import Spinner from "../../../ui/Spinner";
import toast from "react-hot-toast";
import { http } from "../../../api/http";
import { Send } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const eventId = Number(id);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // CARICA EVENTO + REGISTRAZIONI
  // --------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const data = await getEventById(eventId);
        setEvent(data);

        if (token) {
          const reg = await checkIsRegistered(eventId, token);
          if (typeof reg === "object") {
            setIsRegistered(reg.isRegistered);
          }

          if (user && (user.id === data.creatorId || user.role === "admin")) {
            const result = await getRegistrations(eventId, token);
            setRegistrations(result.registrations);
          }
        }
      } catch {
        setError("Errore nel caricamento dell'evento");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId, token, user]);

  // --------------------------------------------------
  // ISCRIZIONE / DISISCRIZIONE
  // --------------------------------------------------
  async function handleRegister() {
    if (!token) return;

    try {
      await registerToEvent(eventId, token);
      setIsRegistered(true);
    } catch {
      toast.error("Errore nell'iscrizione");
    }
  }

  async function handleUnregister() {
    if (!token) return;

    try {
      await unregisterFromEvent(eventId, token);
      setIsRegistered(false);
    } catch {
      toast.error("Errore nella disiscrizione");
    }
  }

  // --------------------------------------------------
  // CHAT: CONTATTA ORGANIZZATORE
  // --------------------------------------------------
  async function handleStartConversationWithCreator() {
    if (!event || !user) return;

    try {
      const conversation = await http<ConversationCreated>(`/messages`, {
        method: "POST",
        body: {
          participantId: event.creatorId,
          eventId: event.id,
        },
      });

      navigate(`/messages/${conversation.id}`, {
        state: {
          otherUserId: event.creatorId,
        },
      });
    } catch {
      toast.error("Errore nell'apertura della chat");
    }
  }

  // --------------------------------------------------
  // CHAT: CONTATTA ISCRITTO
  // --------------------------------------------------
  async function handleMessageUser(participantId: number) {
    if (!event) return;

    try {
      const conversation = await http<ConversationCreated>(`/messages`, {
        method: "POST",
        body: {
          participantId,
          eventId: event.id,
        },
      });

      navigate(`/messages/${conversation.id}`, {
        state: {
          otherUserId: participantId,
        },
      });
    } catch {
      toast.error("Errore nell'apertura della chat");
    }
  }

  // --------------------------------------------------
  // ELIMINA EVENTO
  // --------------------------------------------------
  async function handleDelete() {
    if (!token) return;

    const ok = confirm("Sei sicuro di voler eliminare questo evento?");
    if (!ok) return;

    try {
      await deleteEvent(eventId, token);
      toast.success("Evento eliminato");
      navigate("/events");
    } catch {
      toast.error("Errore nell'eliminazione dell'evento");
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  if (loading) return <Spinner />;

  if (error || !event)
    return (
      <p className="text-center py-10 text-zinc-500">
        {error || "Evento non trovato"}
      </p>
    );

  const canManage =
    user && (user.id === event.creatorId || user.role === "admin");

  const isCreator = user && user.id === event.creatorId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* HERO IMAGE */}
      <div className="relative rounded-xl overflow-hidden mb-5">
        {event.image ? (
          <img src={event.image} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-zinc-200 flex items-center justify-center text-zinc-500">
            Nessuna immagine
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-semibold text-white drop-shadow">
            {event.title}
          </h1>
        </div>
      </div>

      {/* INFO */}
      <Card className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 mt-1">
          <img
            src={event.creator?.avatarUrl || "/default-avatar.png"}
            className="w-6 h-6 rounded-full object-cover border border-white/40"
          />
          <span className="text-white/90 text-sm drop-shadow">
            {event.creator?.nickname || "Organizzatore"}
          </span>
        </div>
        <p className="text-md text-black">
          {event.city}, {event.region}
        </p>

        <p className="text-md text-black">
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        <p className="text-md text-black leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {event.eventTypes.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        {/* CTA */}
        {user && !isCreator && (
          <div className="mt-4">
            {isRegistered ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleUnregister}
              >
                Disiscriviti
              </Button>
            ) : (
              <Button className="w-full" onClick={handleRegister}>
                Iscriviti
              </Button>
            )}
          </div>
        )}

        {user && !isCreator && isRegistered && (
          <Button
            className="w-full mt-2"
            onClick={handleStartConversationWithCreator}
          >
            Contatta organizzatore
          </Button>
        )}

        {canManage && (
          <div className="flex gap-2 mt-4">
            <Link to={`/events/${eventId}/edit`} className="flex-1">
              <Button variant="secondary" className="w-full">
                Modifica
              </Button>
            </Link>

            <Button variant="danger" onClick={handleDelete}>
              Elimina
            </Button>
          </div>
        )}
      </Card>

      {/* REGISTRATIONS */}
      {canManage && (
        <Card className="mt-5 p-4">
          <h2 className="font-semibold text-zinc-900 mb-3">Iscritti</h2>

          {registrations.length === 0 ? (
            <p className="text-zinc-600 text-sm">Nessun iscritto</p>
          ) : (
            <div className="flex flex-col gap-3">
              {registrations.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {r.user.nickname}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleMessageUser(r.userId)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    <span className="text-sm">Contatta</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
