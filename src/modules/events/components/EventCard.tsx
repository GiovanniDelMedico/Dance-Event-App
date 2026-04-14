import { Link, useNavigate } from "react-router-dom";
import type { Event } from "../types";
import { useAuth } from "../../../context/AuthContext";
import { deleteEvent } from "../../../api/events.api";

// UI
import Card from "../../../ui/Card";
import Button from "../../../ui/Button";
import Badge from "../../../ui/Badge";
import toast from "react-hot-toast";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // 🔥 creator OR admin
  const canManage =
    user && (user.id === event.creatorId || user.role === "admin");

  async function handleDelete() {
    if (!token) return;

    const ok = confirm("Sei sicuro di voler eliminare questo evento?");
    if (!ok) return;

    try {
      await deleteEvent(event.id, token);
      toast.success("Evento eliminato");
      navigate(0); // ricarica la lista eventi
    } catch {
      toast.error("Errore nell'eliminazione dell'evento");
    }
  }

  return (
    <Card className="flex flex-col gap-4">

      {/* Immagine */}
      <Link to={`/events/${event.id}`}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
            Nessuna immagine
          </div>
        )}
      </Link>

      {/* Info */}
      <div>
        <Link to={`/events/${event.id}`}>
          <h3 className="text-xl font-bold hover:underline">{event.title}</h3>
        </Link>

        <p className="text-gray-600">
          {event.city}, {event.region}
        </p>

        <p className="text-gray-500 text-sm">
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        <div className="flex gap-2 flex-wrap mt-2">
          {event.eventTypes.map((type) => (
            <Badge key={type}>{type}</Badge>
          ))}
        </div>
      </div>

      {/* Pulsanti */}
      <div className="flex justify-between items-center mt-4">

        {/* Dettagli */}
        <Link to={`/events/${event.id}`}>
          <Button variant="primary">Dettagli</Button>
        </Link>

        {/* Modifica + Elimina */}
        {canManage && (
          <div className="flex gap-2">
            <Link to={`/events/${event.id}/edit`}>
              <Button variant="secondary">Modifica</Button>
            </Link>

            <Button variant="danger" onClick={handleDelete}>
              Elimina
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
