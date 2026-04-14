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
import { useAuth } from "../../../context/AuthContext";

// UI components
import Button from "../../../ui/Button";
import Badge from "../../../ui/Badge";
import Card from "../../../ui/Card";
import Spinner from "../../../ui/Spinner";
import toast from "react-hot-toast";

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

          // Lista iscritti → solo creator o admin
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

  async function handleRegister() {
    if (!token) return alert("Devi essere loggato per iscriverti");

    try {
      await registerToEvent(eventId, token);
      setIsRegistered(true);
    } catch {
      alert("Errore nell'iscrizione");
    }
  }

  async function handleUnregister() {
    if (!token) return;

    try {
      await unregisterFromEvent(eventId, token);
      setIsRegistered(false);
    } catch {
      alert("Errore nella disiscrizione");
    }
  }

  // 🔥 ELIMINA EVENTO (creator o admin)
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

  if (loading) return <Spinner />;
  if (error || !event)
    return <p className="text-center py-10">{error || "Evento non trovato"}</p>;

  const canManage =
    user && (user.id === event.creatorId || user.role === "admin");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full rounded-lg shadow mb-6"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            Nessuna immagine
          </div>
        )}

        <p className="text-gray-700 mb-4">{event.description}</p>

        <p className="mb-2">
          <strong>Data:</strong>{" "}
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        <p className="mb-2">
          <strong>Luogo:</strong> {event.city}, {event.region}
        </p>

        <p className="mb-4">
          <strong>Categoria:</strong> {event.category}
        </p>

        <div className="mb-6">
          <strong>Tipi evento:</strong>
          <div className="flex gap-2 mt-2 flex-wrap">
            {event.eventTypes.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>

        {/* ISCRIZIONE */}
        {user && (
          <div className="flex gap-4 mb-6">
            {isRegistered ? (
              <Button variant="secondary" onClick={handleUnregister}>
                Disiscriviti
              </Button>
            ) : (
              <Button variant="primary" onClick={handleRegister}>
                Iscriviti
              </Button>
            )}
          </div>
        )}

        {/* 🔥 MODIFICA + ELIMINA (creator o admin) */}
        {canManage && (
          <div className="flex gap-4 mb-10">
            <Link to={`/events/${eventId}/edit`}>
              <Button variant="primary">Modifica evento</Button>
            </Link>

            <Button variant="danger" onClick={handleDelete}>
              Elimina evento
            </Button>
          </div>
        )}
      </Card>

      {/* LISTA ISCRITTI (solo creator o admin) */}
      {canManage && (
        <Card>
          <h2 className="text-xl font-semibold mb-3">Iscritti</h2>

          {registrations.length === 0 ? (
            <p className="text-gray-600">Nessun iscritto</p>
          ) : (
            <ul className="space-y-2">
              {registrations.map((r) => (
                <li
                  key={r.id}
                  className="p-3 bg-gray-50 rounded shadow flex justify-between"
                >
                  <span>{r.user.name}</span>
                  <span className="text-gray-500 text-sm">{r.user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
