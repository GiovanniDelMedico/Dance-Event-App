import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getEvents } from "../../../api/events.api";
import type { Event } from "../../events/types";
import EventCard from "../../events/components/EventCard";
import Card from "../../../ui/Card";
import { http } from "../../../api/http";
import type { User } from "../types";
import SubscribedEvents from "./SubscribedEvents";
import Avatar from "../Avatar"; // <-- IMPORT AGGIUNTO

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Avatar state
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.avatarUrl) {
      setPreview(user.avatarUrl);
    }
  }, [user]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvents({});
        const myEvents = data.filter((e: Event) => e.creatorId === user?.id);
        setEvents(
          myEvents.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    if (user) load();
  }, [user]);

  // Cambia avatar (solo preview)
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  // Salva avatar nel backend
  async function saveAvatar() {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setSaving(true);

      const updatedUser = await http("/users/avatar", {
        method: "POST",
        body: formData,
      });

      setUser(updatedUser as User);
      setFile(null);
    } catch (err) {
      console.error("Errore upload avatar:", err);
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-zinc-500">
        Devi effettuare il login
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* PROFILE CARD */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* AVATAR UPLOAD */}
          <div className="flex flex-col items-center gap-2">

            <Avatar
              src={preview}
              alt={user.nickname}
              size={128} // 32 * 4
            />

            {/* Hidden input */}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* Link per cambiare immagine */}
            <button
              onClick={() => document.getElementById("avatar-input")?.click()}
              className="
                text-sm text-purple-600 font-medium
                hover:underline cursor-pointer
              "
            >
              Cambia immagine profilo
            </button>
          </div>

          {/* INFO */}
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold text-zinc-900">
              {user.nickname}
            </h1>

            <p className="text-sm text-zinc-500">@{user.nickname}</p>

            <p className="text-sm text-zinc-500">{user.email}</p>

            <span
              className="
                inline-block mt-2
                text-xs font-medium
                px-3 py-1 rounded-full
                bg-zinc-900 text-white
              "
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* SAVE AVATAR */}
        {file && (
          <div className="mt-4 flex justify-center sm:justify-end">
            <button
              onClick={saveAvatar}
              disabled={saving}
              className="
                text-sm px-4 py-2 rounded-lg
                bg-purple-600 text-white
                hover:bg-purple-500 transition
                disabled:opacity-50
              "
            >
              {saving ? "Salvataggio..." : "Salva immagine"}
            </button>
          </div>
        )}
      </Card>

      {/* EVENTS SECTION */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-zinc-900">
          I tuoi eventi
        </h2>

        {loading ? (
          <p className="text-zinc-500">Caricamento...</p>
        ) : events.length === 0 ? (
          <Card className="p-6 text-center text-zinc-500">
            Nessun evento creato ancora
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900">
            Eventi a cui sei iscritto
          </h2>

          <SubscribedEvents />
        </div>
      </div>
    </div>
  );
}
