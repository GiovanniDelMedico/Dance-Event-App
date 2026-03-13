import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";
import EventForm from "../components/EventForm";
import type { Event } from "../types/Event";

export default function EventCreate() {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    date: "",
    city: "",
    category: "",
    description: "",
    image: ""
  };

  const handleSubmit = async (data: Omit<Event, "id">) => {
    await createEvent(data);
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Crea nuovo evento</h1>
      <EventForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Crea evento"
      />
    </div>
  );
}
