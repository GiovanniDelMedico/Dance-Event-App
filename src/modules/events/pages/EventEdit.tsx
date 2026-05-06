import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { getEventById, updateEvent, uploadImage } from "../../../api/events.api";
import type { Event, EventFormData } from "../types";
import { useAuth } from "../../../context/AuthContext";
import EventForm from "../components/EventForm";
import Card from "../../../ui/Card";
import toast from "react-hot-toast";

export default function EventEdit() {
  const { id } = useParams();
  const eventId = Number(id);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Carica l'evento da modificare
  useEffect(() => {
    async function load() {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch {
        setError("Errore nel caricamento dell'evento");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId]);

  // Controllo creator
  if (!loading && event && user && event.creatorId !== user.id) {
    return <Navigate to="/events" replace />;
  }

  async function handleSubmit(data: EventFormData, imageFile?: File | null) {
    if (!token) {
      toast.error("Devi essere loggato per modificare un evento");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let imageUrl = event?.image || null;

      // Upload nuova immagine
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile, token);
        imageUrl = uploadRes.url;
      }

      // Aggiorna evento
      const finalData: EventFormData = {
        ...data,
        image: imageUrl,
      };

      await updateEvent(eventId, finalData, token);

      toast.success("Evento aggiornato con successo!");
      navigate(`/events/${eventId}`);

    } catch (err: any) {
      const msg = err.message || "Errore nell'aggiornamento dell'evento";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center py-10 text-zinc-600">
        Caricamento...
      </p>
    );
  }

  if (error || !event) {
    return (
      <p className="text-center py-10 text-zinc-600">
        {error || "Evento non trovato"}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">
          Modifica evento
        </h1>

        <p className="text-sm text-zinc-600">
          Aggiorna i campi qui sotto per modificare l'evento.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600 font-medium bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}
      </Card>

      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
