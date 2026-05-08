import { Link, useNavigate } from "react-router-dom";
import type { Event } from "../types";
import { useAuth } from "../../../context/AuthContext";
import { deleteEvent } from "../../../api/events.api";

import Card from "../../../ui/Card";
import Button from "../../../ui/Button";
import Badge from "../../../ui/Badge";
import toast from "react-hot-toast";
import Avatar from "../../users/Avatar"; // <-- IMPORT AGGIUNTO

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const canManage =
    user && (user.id === event.creatorId || user.role === "admin");

  async function handleDelete() {
    if (!token) return;

    const ok = confirm("Sei sicuro di voler eliminare questo evento?");
    if (!ok) return;

    try {
      await deleteEvent(event.id, token);
      toast.success("Evento eliminato");
      navigate(0);
    } catch {
      toast.error("Errore nell'eliminazione dell'evento");
    }
  }

  return (
    <Card className="overflow-hidden p-0">
      {/* IMAGE */}
      <Link to={`/events/${event.id}`} className="block relative group">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="
              w-full h-56 object-cover
              transition duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="w-full h-56 bg-zinc-200 flex items-center justify-center text-zinc-500">
            Nessuna immagine
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* TITLE */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white text-lg font-semibold leading-tight drop-shadow">
            {event.title}
          </h3>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">

        {/* CREATOR INFO */}
        <div className="flex items-center gap-2 mt-1">
          <Avatar
            src={event.creator?.avatarUrl}
            alt={event.creator?.nickname}
            size={24}
          />
          <span className="text-black text-sm">
            {event.creator?.nickname || "Organizzatore"}
          </span>
        </div>

        {/* LOCATION */}
        <p className="text-md text-black">
          {event.city}, {event.region}
        </p>

        {/* DATE */}
        <p className="text-md text-black">
          {new Date(event.date).toLocaleDateString("it-IT")}
        </p>

        {/* TYPES */}
        <div className="flex gap-2 flex-wrap mt-2">
          {event.eventTypes.map((type) => (
            <Badge key={type}>{type}</Badge>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-4">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button className="w-full">Dettagli</Button>
          </Link>

          {canManage && (
            <div className="flex gap-2 ml-2">
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="secondary">✏️</Button>
              </Link>

              <Button variant="danger" onClick={handleDelete}>
                🗑
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
