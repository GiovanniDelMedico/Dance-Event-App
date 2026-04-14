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
  function handleChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  return (
    <div className="event-filters">

      {/* REGIONE */}
      <select name="region" value={filters.region} onChange={handleChange}>
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
      />

      {/* CATEGORIA */}
      <select name="category" value={filters.category} onChange={handleChange}>
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
      />

      {/* TIPO EVENTO */}
      <select
        name="eventType"
        value={filters.eventType}
        onChange={handleChange}
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
