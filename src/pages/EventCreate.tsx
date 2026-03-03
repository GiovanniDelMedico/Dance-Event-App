import { useState } from "react";
import { createEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

export default function EventCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!title || !date || !city || !category || !description){
      alert("compila tutti i campi");
      return;
    }
    await createEvent({
      title,
      date,
      city,
      category,
      description,
    });
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Crea Evento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Titolo</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Campo data */}
        <div>
          <label className="block font-medium">Data</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Campo città */}
        <div>
          <label className="block font-medium">Città</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Campo categoria */}
        <div>
          <label className="block font-medium">Categoria</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Campo descrizione */}
        <div>
          <label className="block font-medium">Descrizione</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Pulsanti */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crea
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
