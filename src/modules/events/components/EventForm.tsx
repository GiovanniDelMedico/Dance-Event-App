import { useEffect, useState } from "react";
import type { Event, EventFormData } from "../types";
import { REGIONS } from "../../../constants/regions";

// UI components
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Button from "../../../ui/Button";
import Card from "../../../ui/Card";

interface Props {
  initialData?: Event | null;
  onSubmit: (data: EventFormData, imageFile?: File | null) => void;
  loading?: boolean;
}

export default function EventForm({ initialData, onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Precompila i campi se siamo in modalità "edit"
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(initialData.date.slice(0, 10)); // ISO → yyyy-mm-dd
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

    const data: EventFormData = {
      title,
      description,
      date,
      region,
      city,
      category,
      eventTypes,
      image: initialData?.image || null,
    };

    onSubmit(data, imageFile);
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITOLO */}
        <div>
          <label className="block mb-1 font-medium">Titolo</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo evento"
            required
          />
        </div>

        {/* DESCRIZIONE */}
        <div>
          <label className="block mb-1 font-medium">Descrizione</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione"
            required
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DATA */}
        <div>
          <label className="block mb-1 font-medium">Data</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* REGIONE */}
        <div>
          <label className="block mb-1 font-medium">Regione</label>
          <Select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">Seleziona regione</option>
            {REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </Select>
        </div>

        {/* CITTÀ */}
        <div>
          <label className="block mb-1 font-medium">Città</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Bologna, Milano..."
            required
          />
        </div>

        {/* CATEGORIA */}
        <div>
          <label className="block mb-1 font-medium">Categoria</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleziona categoria</option>
            <option value="Danza">Danza</option>
            <option value="Hip Hop">Hip Hop</option>
            <option value="Breakdance">Breakdance</option>
            <option value="House">House</option>
            <option value="Popping">Popping</option>
            <option value="Locking">Locking</option>
          </Select>
        </div>

        {/* EVENT TYPES */}
        <div>
          <label className="block mb-2 font-medium">Tipi evento</label>

          <div className="grid grid-cols-2 gap-2">
            {["Battle", "Workshop", "Showcase", "Stage"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventTypes.includes(type)}
                  onChange={() => toggleEventType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* IMMAGINE */}
        <div>
          <label className="block mb-2 font-medium">Immagine evento</label>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
              Nessuna immagine
            </div>
          )}

          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Salvataggio..." : "Salva evento"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
