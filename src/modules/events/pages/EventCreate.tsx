import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, uploadImage } from "../../../api/events.api";
import type { EventFormData } from "../types";
import { useAuth } from "../../../context/AuthContext";
import EventForm from "../components/EventForm";
import Card from "../../../ui/Card";
import Button from "../../../ui/Button";
import toast from "react-hot-toast";

export default function EventCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: EventFormData, imageFile?: File | null) {
    if (!token) {
      toast.error("Devi essere loggato per creare un evento");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl: string | null = null;

      // 1️⃣ Upload immagine se presente
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile, token);
        imageUrl = uploadRes.url;
      }

      // 2️⃣ Creazione evento
      const finalData: EventFormData = {
        ...data,
        image: imageUrl,
      };

      const created = await createEvent(finalData, token);

      toast.success("Evento creato con successo!");

      // 3️⃣ Redirect
      navigate(`/events/${created.id}`);

    } catch (err: any) {
      const msg = err?.message || "Errore nella creazione dell'evento";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      <Card className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Crea un nuovo evento</h1>
        <p className="text-gray-600">
          Compila i campi qui sotto per aggiungere un nuovo evento alla piattaforma.
        </p>

        {error && (
          <p className="mt-4 text-red-600 font-medium">
            {error}
          </p>
        )}
      </Card>

      <EventForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
