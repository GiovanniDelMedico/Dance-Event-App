import type { Event } from "../types/Event";

const BASE_URL ="http://localhost:3000/events";

export async function getEvents(filters?: {
  city?: string;
  category?: string;
  date?: string;
}): Promise<Event[]> {
  const params = new URLSearchParams();

  if (filters?.city) params.append("city", filters.city);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.date) params.append("date", filters.date);

  const url = params.toString()
    ? `${BASE_URL}?${params.toString()}`
    : BASE_URL;

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


export async function createEvent(data: Omit<Event,"id">):Promise<Event>{
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL,{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,   // <--- AGGIUNTO
    body: JSON.stringify(data),
  });
  if(!res.ok) throw new Error ("Errore nella creazione dell'evento");
    return res.json();
}

export async function deleteEvent(id:number): Promise<void>{
  const token = localStorage.getItem("token");

   const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
  });

    if(!res.ok) throw new Error("Errore nella cancellazione dell'evento");
}

export async function updateEvent(id:number,data:Omit<Event, "id">): Promise<Event>{
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${id}`,{
    method:"PUT",
    headers:  {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    } as Record<string, string>,
    body: JSON.stringify(data),
  });
  
  if(!res.ok) throw new Error("Errore nell'aggiornamento dell'evento");
  return res.json();
}









// export let events: Event[] = [
 
// ];

// export function getEvents(): Promise<Event[]> {
//   return Promise.resolve(events);
// }

// export function createEvent(data: Omit<Event, "id">): Promise<Event> {
//   const newId =
//     events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
//   const newEvent: Event = {
//     id: newId,
//     ...data,
//   };
//   events.push(newEvent);
//   return Promise.resolve(newEvent);
// }

// export function deleteEvent(id: number): Promise<void> {
//   events = events.filter((e) => e.id !== id);
//   return Promise.resolve();
// }

// export function updateEvent(
//   id: number,
//   data: Omit<Event, "id">,
// ): Promise<Event> {
//   const index = events.findIndex((e) => e.id === id);
//   if (index === -1) return Promise.reject("Evento non trovato");
//   const updated: Event = { id, ...data };
//   events[index] = updated;

//   return Promise.resolve(updated);
// }
