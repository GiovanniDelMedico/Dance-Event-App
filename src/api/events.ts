import type { Event, EventFormData } from "../types/Event";

const BASE_URL = "http://localhost:3000/events";

export async function getEvents(filters?: {
  region?: string;
  city?: string;
  category?: string;
  date?: string;
  eventType?: string; // 🆕 aggiunto
}): Promise<Event[]> {
  const params = new URLSearchParams();

  if (filters?.region) params.append("region", filters.region);
  if (filters?.city) params.append("city", filters.city);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.date) params.append("date", filters.date);
  if (filters?.eventType) params.append("eventType", filters.eventType); // 🆕 aggiunto

  const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Errore nel recupero degli eventi");
  return res.json();
}

export async function getEventById(id: number): Promise<Event> {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Errore nel recupero dell'evento");
  }

  return res.json();
}

export async function createEvent(data: EventFormData): Promise<Event> {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // 🆕 proviamo a leggere il messaggio del backend
    let errorMessage = "Errore nella creazione dell'evento";

    try {
      const body = await res.json();
      if (body?.message) {
        errorMessage = body.message; // messaggio del backend
      }
    } catch {
      // se il backend non manda JSON, ignoriamo
    }

    const error: any = new Error(errorMessage);
    error.status = res.status; // 🆕 fondamentale
    throw error;
  }

  return res.json();
}


export async function deleteEvent(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
  });

  if (!res.ok) throw new Error("Errore nella cancellazione dell'evento");
}

export async function updateEvent(
  id: number,
  data: Omit<Event, "id">,
): Promise<Event> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Errore nell'aggiornamento dell'evento");
  return res.json();
}

//Funzione api per iscriversi ad un evento
export async function registerToEvent(eventId: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${eventId}/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
  });

  if (!res.ok) {
    throw new Error("Errore nell'iscrizione all'evento");
  }
}
//Funzione api per DISiscriversi ad un evento
export async function unregisterFromEvent(eventId: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${eventId}/register`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
  });

  if (!res.ok) {
    throw new Error("Errore nella disiscrizione dall'evento");
  }
}

// Recupera la lista degli iscritti a un evento
export async function getRegistrations(eventId: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${eventId}/registrations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
  });

  if (res.status === 403) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Errore nel recupero degli iscritti");
  }

  return res.json();
}

export async function checkIsRegistered(eventId: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:3000/events/${eventId}/is-registered`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) return false;

  const data = await res.json();
  return data.isRegistered;
}
