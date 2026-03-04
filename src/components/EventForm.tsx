import { useState } from "react";
import type { Event } from "../types/Event";

interface EventFormProps {
  initialValues: Omit<Event, "id">;
  onSubmit: (data: Omit<Event, "id">) => Promise<void>;
  submitLabel: string;
}

export default function EventForm({ initialValues, onSubmit, submitLabel }: EventFormProps) {
  const [formData, setFormData] = useState<Omit<Event, "id">>(initialValues);

  const handleChange = (field: keyof Omit<Event, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Titolo</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Data</label>
        <input
          type="date"
          className="border p-2 w-full"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Città</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Categoria</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Descrizione</label>
        <textarea
          className="border p-2 w-full"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">URL immagine</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={formData.image}
          onChange={(e) => handleChange("image", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {submitLabel}
      </button>
    </form>
  );
}
