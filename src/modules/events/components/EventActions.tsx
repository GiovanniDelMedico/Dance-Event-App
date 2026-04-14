import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../../../api/events.api";
import type { Event } from "../types";
import { useAuth } from "../../../context/AuthContext";

interface Props {
  event: Event;
}

export default function EventActions({ event }: Props) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isCreator = user && user.id === event.creatorId;

  async function handleDelete() {
    if (!token) {
      alert("Devi essere loggato per eliminare un evento");
      return;
    }

    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare questo evento?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEvent(event.id, token);
      navigate("/events");
    } catch (err) {
      alert("Errore nella cancellazione dell'evento");
    }
  }

  if (!isCreator) return null;

  return (
    <div className="event-actions-admin">
      <button
        className="btn-secondary"
        onClick={() => navigate(`/events/${event.id}/edit`)}
      >
        Modifica
      </button>

      <button className="btn-danger" onClick={handleDelete}>
        Elimina
      </button>
    </div>
  );
}
