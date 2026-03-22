import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import EventActions from "./EventActions";

interface EventCardProps {
  event: Event;
  onDelete?: (id: number) => void; // permette a EventList di aggiornare la UI
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      {/* Parte cliccabile */}
      <div
        onClick={() => navigate(`/events/${event.id}`)}
        className="cursor-pointer hover:bg-gray-50"
      >
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
        </div>
      </div>

      <EventActions
        onEdit={() => navigate(`/events/${event.id}/edit`)}
        onDelete={() => onDelete?.(event.id)}
        stopPropagation
        creatorId={event.creatorId} 
      />
    </div>
  );
}
