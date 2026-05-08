import { useEffect, useState } from "react";
import { getEvents } from "../../../api/events.api";
import type { Event } from "../types";
import OnboardingWizard from "../../onboarding/OnboardingWizard";

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
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

         <OnboardingWizard />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          Eventi
        </h1>

        <p className="text-sm text-zinc-600 mt-1">
          Scopri battle, jam e sessioni nella tua zona
        </p>
      </div>

      {/* FILTRI */}
      <div id="event-filters" className="mb-6">
        <Card className="p-4">
          <EventFilters filters={filters} setFilters={setFilters} />
        </Card>
      </div>

      {/* GRID */}
      <div
        className="
          grid gap-5
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {events.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-zinc-600">
              Nessun evento trovato
            </p>
          </div>
        )}

        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}