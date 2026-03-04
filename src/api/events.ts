import type { Event } from "../types/Event";

export let events: Event[] = [
  {
    id: 1,
    title: "Pc Hip Hop Jam",
    date: "2026-04-25",
    city: "Bologna",
    category: "U18",
    description: "Laboratorio intensivo di Hip Hop.",
    image: "https://via.placeholder.com/400x250",
  },
  {
    id: 2,
    title: "Hip Hop Workshop",
    date: "2024-05-10",
    city: "Bologna",
    category: "O18",
    description: "Laboratorio intensivo di Hip Hop.",
    image: "https://via.placeholder.com/400x250",
  },
  {
    id: 3,
    title: "Popping Workshop",
    date: "2024-05-10",
    city: "U18",
    category: "Workshop",
    description: "Laboratorio intensivo di Hip Hop.",
    image: "https://via.placeholder.com/400x250",
  },
];

export function getEvents(): Promise<Event[]> {
  return Promise.resolve(events);
}

export function createEvent(data: Omit<Event, "id">): Promise<Event> {
  const newId =
    events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
  const newEvent: Event = {
    id: newId,
    ...data,
  };
  events.push(newEvent);
  return Promise.resolve(newEvent);
}

export function deleteEvent(id: number): Promise<void> {
  events = events.filter((e) => e.id !== id);
  return Promise.resolve();
}

export function updateEvent(
  id: number,
  data: Omit<Event, "id">,
): Promise<Event> {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return Promise.reject("Evento non trovato");
  const updated: Event = { id, ...data };
  events[index] = updated;

  return Promise.resolve(updated);
}
