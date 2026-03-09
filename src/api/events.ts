import type { Event } from "../types/Event";

const BASE_URL ="http://localhost:3000/events";

export async function getEvents(): Promise<Event[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Errore nel recupero degli eventi");
  return res.json();
}

export async function createEvent(data: Omit<Event,"id">):Promise<Event>{
  const res = await fetch(BASE_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data),
  });
  if(!res.ok) throw new Error ("Errore nella creazione dell'evento");
    return res.json();
}

export async function deleteEvent(id:number): Promise<void>{
  const res = await fetch(`${BASE_URL}/${id}`,{
    method:"DELETE",});
    if(!res.ok) throw new Error("Errore nella cancellazione dell'evento");
}

export async function updateEvent(id:number,data:Omit<Event, "id">): Promise<Event>{
  const res = await fetch(`${BASE_URL}/${id}`,{
    method:"PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
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
