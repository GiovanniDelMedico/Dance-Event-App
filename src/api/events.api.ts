import { http, API_URL } from "./http";
import type { Event, EventFormData } from "../modules/events/types";

// GET /events
export function getEvents(filters?: {
  region?: string;
  city?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
}) {
  const params = new URLSearchParams();

  if (filters?.region) params.append("region", filters.region);
  if (filters?.city) params.append("city", filters.city);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.eventType) params.append("eventType", filters.eventType);

  const query = params.toString() ? `?${params.toString()}` : "";

  return http<Event[]>(`/events${query}`);
}



// GET /events/:id
export function getEventById(id: number) {
  return http<Event>(`/events/${id}`);
}

// POST /events
export function createEvent(data: EventFormData, token: string) {
  return http<Event>("/events", {
    method: "POST",
    body: data,   // ✔ oggetto, NON stringa
    token,
  });
}

// PUT /events/:id
export function updateEvent(id: number, data: EventFormData, token: string) {
  return http<Event>(`/events/${id}`, {
    method: "PUT",
    body: data,   // ✔ oggetto, NON stringa
    token,
  });
}

// DELETE /events/:id
export function deleteEvent(id: number, token: string) {
  return http(`/events/${id}`, {
    method: "DELETE",
    token,
  });
}

// POST /events/:id/register
export function registerToEvent(eventId: number, token: string) {
  return http(`/events/${eventId}/register`, {
    method: "POST",
    body: {},   // ✔ oggetto vuoto, NON stringa
    token,
  });
}

// DELETE /events/:id/register
export function unregisterFromEvent(eventId: number, token: string) {
  return http(`/events/${eventId}/register`, {
    method: "DELETE",
    token,
  });
}

// GET /events/:id/registrations
export function getRegistrations(eventId: number, token: string) {
  return http<any>(`/events/${eventId}/registrations`, {
    method: "GET",
    token,
  });
}

// GET /events/:id/is-registered
export function checkIsRegistered(eventId: number, token: string) {
  return http<{ isRegistered: boolean }>(`/events/${eventId}/is-registered`, {
    method: "GET",
    token,
  });
}
// GET /users/me/registered-events
// (nuovo endpoint: eventi a cui l’utente è iscritto)
// --------------------------------------------------
export function getRegisteredEvents(token: string) {
  return http<{ events: Event[] }>("/users/me/registered-events", {
    method: "GET",
    token,
  });
}

// POST /events/upload (form-data)
export async function uploadImage(file: File, token: string): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/events/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Errore nell'upload dell'immagine");
  }

  return res.json();
}



