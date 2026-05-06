import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getRegisteredEvents } from "../../../api/events.api";
import EventCard from "../../events/components/EventCard";
import Card from "../../../ui/Card";

import type { Event } from "../../events/types";

export default function SubscribedEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token) return;

      try {
        const result = await getRegisteredEvents(token);
        const sorted = result.events.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setEvents(sorted);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) {
    return <p className="text-zinc-500">Caricamento...</p>;
  }

  if (events.length === 0) {
    return (
      <Card className="p-6 text-center text-zinc-500">
        Non sei iscritto a nessun evento
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} />
      ))}
    </div>
  );
}
