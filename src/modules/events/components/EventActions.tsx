import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../../../api/events.api";
import type { Event } from "../types";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../ui/Button";

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
    } catch {
      alert("Errore nella cancellazione dell'evento");
    }
  }

  if (!isCreator) return null;

  return (
    <div className="flex gap-3 mt-4">

      {/* EDIT */}
      <Button
        variant="secondary"
        onClick={() => navigate(`/events/${event.id}/edit`)}
      >
        Modifica
      </Button>

      {/* DELETE */}
      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Elimina
      </Button>

    </div>
  );
}
