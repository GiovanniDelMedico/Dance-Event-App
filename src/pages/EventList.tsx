import { useEffect, useState } from "react";
import { getEvents,deleteEvent } from "../api/events";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";


export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleDeleteFromList = async (id:number)=>{
    await deleteEvent(id);
    setEvents((prev)=>prev.filter((e)=>e.id !==id));
  ;};

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
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard 
            key={event.id}
            event = {event}
            onDelete ={handleDeleteFromList}
            />
          ))}
        </div>
      </div>
    </>
  );
}
