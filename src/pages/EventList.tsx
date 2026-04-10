import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import { useAuth } from "../context/AuthContext";

export default function EventsList() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);

  // 🆕 aggiungiamo lo stato per la tipologia
  const [eventType, setEventType] = useState("");

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    getEvents({ region, city, category, date, eventType }).then(setEvents);
  }, [region, city, category, date, eventType]); // 🆕 aggiunto eventType

  const handleDeleteFromList = async (id: number) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Ciao, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Login
              </button>

              {/* 🆕 Pulsante Iscriviti */}
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Iscriviti
              </button>
            </div>
          )}

          {user && (
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Crea nuovo evento
            </button>
          )}
        </div>

        <div>
          <EventFilters
            eventType={eventType} // 🆕 aggiunto
            region={region}
            city={city}
            category={category}
            date={date}
            onEventTypeChange={setEventType} // 🆕 aggiunto
            onRegionChange={setRegion}
            onCityChange={setCity}
            onCategoryChange={setCategory}
            onDateChange={setDate}
          />
        </div>

        <h1 className="text-3xl font-bold mb-6">Eventi in Programma</h1>

        <div className="space-y-6">
          {events.length === 0 ? (
            <p className="text-red-500 text-center mt-10">
              Nessun evento trovato con questi filtri.
            </p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteFromList}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
