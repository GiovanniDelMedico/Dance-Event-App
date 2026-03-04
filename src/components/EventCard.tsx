import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../api/events";

interface EventCardProps {
  event: Event;
  onDelete?: (id: number) => void; // permette a EventList di aggiornare la UI
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteEvent(event.id);
    onDelete?.(event.id); // notifica il parent
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      {/* Immagine */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />

      {/* Contenuto */}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold">{event.title}</h2>

        <p className="text-gray-600 text-sm">
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        <p className="text-gray-700">
          <span className="font-medium">Città:</span> {event.city}
        </p>

        <p className="text-gray-700">
          <span className="font-medium">Categoria:</span> {event.category}
        </p>

        <p className="text-gray-800">{event.description}</p>

        {/* Pulsanti */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={() => navigate(`/edit/${event.id}`)}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Modifica
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
