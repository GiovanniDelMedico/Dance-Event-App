import { useEffect, useState } from "react";
import { useParams, useNavigate,} from "react-router-dom";
import { deleteEvent, getEventById } from "../api/events";
import type { Event } from "../types/Event";
import EventActions from "../components/EventActions";


export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
      if (!id) return;
      
      getEventById(Number(id))
      .then((data) => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async() =>{
        await deleteEvent(event!.id);
        navigate("/")
    }

    if (loading) {
      return <p className="text-center mt-10">Caricamento...</p>;
    }
  
    if (!event) {
      return (
        <p className="text-center mt-10 text-gray-500">Evento non trovato.</p>
      );
    }


  return (
  <div className="max-w-xl mx-auto mt-10 p-4 space-y-6">

    {/* Titolo */}
    <h1 className="text-3xl font-bold">{event.title}</h1>

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
        <span className="font-medium">Città:</span> {event.city}
      </p>

      <p>
        <span className="font-medium">Categoria:</span> {event.category}
      </p>
    </div>

    {/* Descrizione */}
    <p className="text-gray-800">{event.description}</p>
     <EventActions
      onEdit={() => navigate(`/events/${event.id}/edit`)}
      onDelete={handleDelete}
    />
  </div>
);

}
