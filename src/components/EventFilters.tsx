import type { ChangeEvent } from "react";

type Props = {
  city: string;
  category: string;
  date: string;
  onCityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
};

export default function EventFilters({
  city,
  category,
  date,
  onCityChange,
  onCategoryChange,
  onDateChange,
}: Props) {
  return (
    <div className="flex gap-4 mb-6">

      <select
        value={city}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onCityChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Tutte le città</option>
        <option value="Bologna">Bologna</option>
        <option value="Milano">Milano</option>
        <option value="Roma">Roma</option>
      </select>

      <select
        value={category}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Tutte le categorie</option>
        <option value="Hip Hop">Hip Hop</option>
        <option value="House">House</option>
        <option value="Break Dance">Break Dance</option>
        <option value="Locking">Locking</option>
        <option value="Popping">Popping</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onDateChange(e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );
}
