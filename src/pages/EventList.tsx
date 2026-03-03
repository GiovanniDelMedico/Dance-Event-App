import { useEffect, useState } from "react";
import { getEvents } from "../api/events";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crea nuovo evento
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Eventi in Programma</h1>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id}>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.date}</p>
              <p className="mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
