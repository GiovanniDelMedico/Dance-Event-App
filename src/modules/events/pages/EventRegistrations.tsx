import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRegistrations, getEventById } from "../../../api/events.api";
import type { Event, EventRegistration } from "../types";
import { useAuth } from "../../../context/AuthContext";

interface RegistrationWithUser extends EventRegistration {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function EventRegistrations() {
  const { id } = useParams();
  const eventId = Number(id);

  const { token, user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isCreator = user && event && user.id === event.creatorId;

  useEffect(() => {
    async function load() {
      try {
        const ev = await getEventById(eventId);
        setEvent(ev);

        if (!token) {
          setError("Devi essere loggato per vedere gli iscritti");
          return;
        }

        const regs = await getRegistrations(eventId, token);
        setRegistrations(regs);
      } catch (err) {
        setError("Errore nel caricamento degli iscritti");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId, token]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Evento non trovato</p>;

  if (!isCreator) {
    return <p>Solo il creatore dell’evento può vedere gli iscritti.</p>;
  }

  return (
    <div className="event-registrations">
      <h1>Iscritti a: {event.title}</h1>

      {registrations.length === 0 && <p>Nessun iscritto.</p>}

      <ul className="registrations-list">
        {registrations.map((reg) => (
          <li key={reg.id} className="registration-item">
            <p>
              <strong>{reg.user.name}</strong> ({reg.user.email})
            </p>
            <p>
              Iscritto il:{" "}
              {new Date(reg.createdAt).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
