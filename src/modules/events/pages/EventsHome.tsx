import { useEffect, useState } from "react";
import { getEvents } from "../../../api/events.api";
import type { Event } from "../types";

import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import Spinner from "../../../ui/Spinner";
import Card from "../../../ui/Card";

export default function EventsHome() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    region: "",
    city: "",
    category: "",
    date: "",
    eventType: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvents(filters);
        setEvents(data);
      } catch (err) {
        console.error("Errore nel caricamento eventi:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filters]);

  if (loading) {
    return (
      <div className="py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      {/* Titolo */}
      <Card className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Eventi</h1>
        <p className="text-gray-600">
          Esplora gli eventi disponibili o filtra per trovare ciò che ti interessa.
        </p>
      </Card>

      {/* Filtri */}
      <EventFilters filters={filters} setFilters={setFilters} />

      {/* Lista eventi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.length === 0 && (
          <p className="text-gray-600 col-span-full text-center">
            Nessun evento trovato.
          </p>
        )}

        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
