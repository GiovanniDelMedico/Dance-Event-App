// import type { ChangeEvent } from "react";
// import { REGIONS } from "../constants/regions";

// type Props = {
//   eventType: string; // 🆕 aggiunto
//   region: string;
//   city: string;
//   category: string;
//   date: string;
//   onEventTypeChange: (value: string) => void; // 🆕 aggiunto
//   onRegionChange: (value: string) => void;
//   onCityChange: (value: string) => void;
//   onCategoryChange: (value: string) => void;
//   onDateChange: (value: string) => void;
// };

// export default function EventFilters({
//   eventType, // 🆕
//   region,
//   city,
//   category,
//   date,
//   onEventTypeChange, // 🆕
//   onRegionChange,
//   onCityChange,
//   onCategoryChange,
//   onDateChange,
// }: Props) {
//   return (
//     <div className="flex gap-4 mb-6">

//       {/* 🆕 TIPOLOGIA EVENTO — ORA PER PRIMA */}
//       <select
//         value={eventType}
//         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//           onEventTypeChange(e.target.value)
//         }
//         className="border p-2 rounded"
//       >
//         <option value="">Tutte le tipologie</option>
//         <option value="Battle">Battle</option>
//         <option value="Workshop">Workshop</option>
//         <option value="Concorso Coreografico">Concorso Coreografico</option>
//       </select>

//       {/* REGIONE */}
//       <select
//         value={region}
//         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//           onRegionChange(e.target.value)
//         }
//         className="border p-2 rounded"
//       >
//         <option value="">Tutte le regioni</option>
//         {REGIONS.map((r) => (
//           <option key={r} value={r}>
//             {r}
//           </option>
//         ))}
//       </select>

//       {/* CITTÀ */}
//       <select
//         value={city}
//         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//           onCityChange(e.target.value)
//         }
//         className="border p-2 rounded"
//       >
//         <option value="">Tutte le città</option>
//         <option value="Bologna">Bologna</option>
//         <option value="Milano">Milano</option>
//         <option value="Roma">Roma</option>
//       </select>

//       {/* CATEGORIA */}
//       <select
//         value={category}
//         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//           onCategoryChange(e.target.value)
//         }
//         className="border p-2 rounded"
//       >
//         <option value="">Tutte le categorie</option>
//         <option value="Hip Hop">Hip Hop</option>
//         <option value="House">House</option>
//         <option value="Break Dance">Break Dance</option>
//         <option value="Locking">Locking</option>
//         <option value="Popping">Popping</option>
//       </select>

//       {/* DATA */}
//       <input
//         type="date"
//         value={date}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           onDateChange(e.target.value)
//         }
//         className="border p-2 rounded"
//       />
//     </div>
//   );
// }
