import type { ChangeEvent } from "react";
import { REGIONS } from "../../../constants/regions";

interface Filters {
  region: string;
  city: string;
  category: string;
  date: string;
  eventType: string;
}

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
}

export default function EventFilters({ filters, setFilters }: Props) {
  function handleChange(
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  const base =
    "w-full px-3 py-2 text-sm rounded-lg outline-none transition " +
    "bg-zinc-100 text-zinc-900 border border-zinc-300 " +
    "focus:border-purple-500 focus:ring-2 focus:ring-purple-300";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

      {/* REGIONE */}
      <select
        name="region"
        value={filters.region}
        onChange={handleChange}
        className={base}
      >
        <option value="">Tutte le regioni</option>
        {REGIONS.map((reg) => (
          <option key={reg} value={reg}>
            {reg}
          </option>
        ))}
      </select>

      {/* CITTÀ */}
      <input
        type="text"
        name="city"
        placeholder="Città"
        value={filters.city}
        onChange={handleChange}
        className={base}
      />

      {/* CATEGORIA */}
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className={base}
      >
        <option value="">Tutte le categorie</option>
        <option value="Danza">Danza</option>
        <option value="Hip Hop">Hip Hop</option>
        <option value="Breakdance">Breakdance</option>
        <option value="House">House</option>
        <option value="Popping">Popping</option>
        <option value="Locking">Locking</option>
      </select>

      {/* DATA */}
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleChange}
        className={base}
      />

      {/* TIPO EVENTO */}
      <select
        name="eventType"
        value={filters.eventType}
        onChange={handleChange}
        className={base}
      >
        <option value="">Tutti i tipi</option>
        <option value="Battle">Battle</option>
        <option value="Workshop">Workshop</option>
        <option value="Showcase">Showcase</option>
        <option value="Stage">Stage</option>
      </select>
    </div>
  );
}
