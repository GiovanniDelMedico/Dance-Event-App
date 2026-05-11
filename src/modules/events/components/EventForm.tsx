import { useEffect, useState } from "react";
import type { Event, EventFormData } from "../types";
import { REGIONS } from "../../../constants/regions";

import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Button from "../../../ui/Button";
import Card from "../../../ui/Card";

interface Props {
  initialData?: Event | null;
  onSubmit: (data: EventFormData, imageFile?: File | null) => void;
  loading?: boolean;
}

export default function EventForm({
  initialData,
  onSubmit,
  loading,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 NUOVI CAMPI
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);

      // 🔥 PRECOMPILA LE DATE
      setStartDate(initialData.startDate.slice(0, 10));
      setEndDate(initialData.endDate.slice(0, 10));

      setRegion(initialData.region);
      setCity(initialData.city);
      setCategory(initialData.category);
      setEventTypes(initialData.eventTypes);
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  function toggleEventType(type: string) {
    setEventTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔥 VALIDAZIONE DATE
    if (new Date(endDate) < new Date(startDate)) {
      alert("La data di fine non può essere prima della data di inizio");
      return;
    }

    const data: EventFormData = {
      title,
      description,
      startDate,
      endDate,
      region,
      city,
      category,
      eventTypes,
      image: initialData?.image || null,
    };

    onSubmit(data, imageFile);
  }

  const chipBase =
    "px-3 py-1 rounded-full text-sm cursor-pointer transition border";

  return (
    <Card className="max-w-2xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">
            {initialData ? "Modifica evento" : "Crea evento"}
          </h2>
          <p className="text-sm text-zinc-500">
            Compila i dettagli del tuo evento
          </p>
        </div>

        {/* GRID BASE INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo evento"
            required
          />

          {/* 🔥 START DATE */}
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          {/* 🔥 END DATE */}
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Città"
            required
          />

          <Select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">Regione</option>
            {REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </Select>

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="sm:col-span-2"
          >
            <option value="">Categoria</option>
            <option value="Mixstyle">Mixstyle</option>
            <option value="Hip Hop">Hip Hop</option>
            <option value="Breakdance">Breakdance</option>
            <option value="House">House</option>
            <option value="Popping">Popping</option>
            <option value="Locking">Locking</option>
          </Select>
        </div>

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione evento..."
          className="
            w-full min-h-[120px]
            px-3 py-2 rounded-lg
            bg-zinc-100
            text-zinc-900
            border border-zinc-300
            outline-none
            focus:ring-2 focus:ring-purple-300 focus:border-purple-500
          "
          required
        />

        {/* EVENT TYPES */}
        <div>
          <p className="text-sm font-medium mb-2">Tipi evento</p>

          <div className="flex flex-wrap gap-2">
            {["Battle", "Workshop", "Showcase", "Stage"].map((type) => {
              const active = eventTypes.includes(type);

              return (
                <div
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`
                    ${chipBase}
                    ${
                      active
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-zinc-100 text-zinc-700 border-zinc-300"
                    }
                  `}
                >
                  {type}
                </div>
              );
            })}
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <p className="text-sm font-medium mb-2">Immagine</p>

          {imagePreview ? (
            <img
              src={imagePreview}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-zinc-200 rounded-lg flex items-center justify-center mb-3 text-zinc-500">
              Nessuna immagine
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Salvataggio..." : "Salva evento"}
        </Button>
      </form>
    </Card>
  );
}

