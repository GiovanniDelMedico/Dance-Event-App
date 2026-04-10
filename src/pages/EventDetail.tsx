import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteEvent,
  getEventById,
  getRegistrations,
  registerToEvent,
  unregisterFromEvent,
  checkIsRegistered,
} from "../api/events";
import type { Event } from "../types/Event";
import EventActions from "../components/EventActions";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(true);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoadingEvent(true);
    getEventById(Number(id))
      .then((data) => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoadingEvent(false));
  }, [id]);

  useEffect(() => {
    if (!id || !user) {
      setLoadingRegistration(false);
      return;
    }

    async function check() {
      try {
        const already = await checkIsRegistered(Number(id));
        setIsRegistered(already);
      } catch (err) {
        console.error("Errore nel controllo iscrizione:", err);
      } finally {
        setLoadingRegistration(false);
      }
    }

    check();
  }, [id, user]);

  async function loadRegistrations() {
    if (!event) return;

    try {
      setLoadingRegistrations(true);
      const data = await getRegistrations(event.id);
      setRegistrations(data.registrations);
      setShowRegistrations(true);
    } catch (err) {
      console.error("Errore nel caricamento iscritti:", err);
      alert("Non hai i permessi per vedere gli iscritti");
    } finally {
      setLoadingRegistrations(false);
    }
  }

  const handleDelete = async () => {
    if (!event) return;
    await deleteEvent(event.id);
    navigate("/");
  };

  const handleToggleRegistration = async () => {
  if (!event || !user) return;

  try {
    setLoadingRegistration(true);

    if (isRegistered) {
      await unregisterFromEvent(event.id);
      setIsRegistered(false);

      // 🆕 Toast disiscrizione
      toast.success("Ti sei disiscritto dall’evento");
    } else {
      await registerToEvent(event.id);
      setIsRegistered(true);

      // 🆕 Toast iscrizione
      toast.success("Iscrizione completata!");
    }
  } catch (err) {
    console.error("Errore durante iscrizione/disiscrizione:", err);
    toast.error("Errore durante l'operazione");
  } finally {
    setLoadingRegistration(false);
  }
};

  if (loadingEvent) {
    return <p className="text-center mt-10">Caricamento...</p>;
  }

  if (!event) {
    return (
      <p className="text-center mt-10 text-gray-500">Evento non trovato.</p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-6">
      <button
        onClick={() => navigate("/")}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
      >
        ← Torna agli eventi
      </button>
      {/* Titolo */}
      <h1 className="text-3xl font-bold">{event.title}</h1>
      {isRegistered && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Sei iscritto
        </div>
      )}

      {/* 🆕 Tipologie evento */}
      {event.eventTypes && event.eventTypes.length > 0 && (
        <p className="text-blue-700 font-medium text-lg">
          {event.eventTypes.join(" • ")}
        </p>
      )}

      {/* Immagine */}
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      )}

      {/* Info principali */}
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-medium">Data:</span>{" "}
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        <p>
          <span className="font-medium">Regione:</span> {event.region}
        </p>

        <p>
          <span className="font-medium">Città:</span> {event.city}
        </p>

        <p>
          <span className="font-medium">Categoria:</span> {event.category}
        </p>
      </div>

      {/* Descrizione */}
      <p className="text-gray-800">{event.description}</p>

      {/* Bottone iscrizione */}
      {user && (
        <button
          onClick={handleToggleRegistration}
          disabled={loadingRegistration}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loadingRegistration
            ? "Verifica..."
            : isRegistered
              ? "Disiscriviti"
              : "Iscriviti"}
        </button>
      )}

      {/* Pulsante iscritti */}
      {(user?.id === event.creatorId || user?.role === "admin") && (
        <button
          onClick={loadRegistrations}
          disabled={loadingRegistrations}
          className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          {loadingRegistrations ? "Caricamento..." : "Vedi iscritti"}
        </button>
      )}

      {/* Lista iscritti */}
      {showRegistrations && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-semibold mb-2">
            Iscritti ({registrations.length})
          </h3>

          {registrations.length === 0 && (
            <p className="text-gray-500">Nessun iscritto.</p>
          )}

          <ul className="space-y-1">
            {registrations.map((r) => (
              <li key={r.id} className="text-gray-800">
                {r.user.name} – {r.user.email}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Azioni admin/creator */}
      <EventActions
        creatorId={event.creatorId}
        onEdit={() => navigate(`/events/${event.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
