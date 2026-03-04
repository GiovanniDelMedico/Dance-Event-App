import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvents, updateEvent } from "../api/events";
import EventForm from "../components/EventForm";
import type { Event } from "../types/Event";

export default function EventEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = Number(id);

  const [initialValues, setInitialValues] = useState<Omit<Event, "id"> | null>(null);

  useEffect(() => {
    getEvents().then((events) => {
      const found = events.find((e) => e.id === eventId);
      if (found) {
        const { id, ...rest } = found;
        setInitialValues(rest);
      }
    });
  }, [eventId]);

  if (!initialValues) return <p>Caricamento...</p>;

  const handleSubmit = async (data: Omit<Event, "id">) => {
    await updateEvent(eventId, data);
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Modifica evento</h1>
      <EventForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Salva modifiche"
      />
    </div>
  );
}
