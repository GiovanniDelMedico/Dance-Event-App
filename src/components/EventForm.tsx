// import { useState } from "react";
// import type { EventFormData } from "../types/Event";
// import { useAuth } from "../context/AuthContext";
// import { REGIONS } from "../constants/regions";
// import { toast } from "react-hot-toast";

// interface EventFormProps {
//   initialValues?: EventFormData;
//   onSubmit: (data: EventFormData) => Promise<void>;
//   submitLabel: string;
// }

// export default function EventForm({
//   initialValues,
//   onSubmit,
//   submitLabel,
// }: EventFormProps) {
//   const [formData, setFormData] = useState<EventFormData>(
//     initialValues || {
//       title: "",
//       date: "",
//       region: "",
//       city: "",
//       category: "",
//       description: "",
//       image: "",
//       eventTypes: [],
//     }
//   );

//   const [imageFile, setImageFile] = useState<File | null>(null);

//   // ANTEPRIMA IMMAGINE
//   const [preview, setPreview] = useState<string | null>(
//     typeof formData.image === "string" && formData.image !== ""
//       ? formData.image
//       : null
//   );

//   // ERRORI DEI CAMPI
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const { token } = useAuth();

//   const handleChange = (field: keyof EventFormData, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Rimuove errore quando l'utente corregge
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) newErrors.title = "Il titolo è obbligatorio";
//     if (!formData.date) newErrors.date = "La data è obbligatoria";
//     if (!formData.region) newErrors.region = "La regione è obbligatoria";
//     if (!formData.city.trim()) newErrors.city = "La città è obbligatoria";
//     if (!formData.category.trim()) newErrors.category = "La categoria è obbligatoria";
//     if (!formData.description.trim()) newErrors.description = "La descrizione è obbligatoria";
//     if (formData.eventTypes.length === 0)
//       newErrors.eventTypes = "Seleziona almeno una tipologia evento";

//     // IMMAGINE obbligatoria (create) o già presente (edit)
//     if (!imageFile && !formData.image)
//       newErrors.image = "L'immagine è obbligatoria";

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validate()) {
//       toast.error("Compila tutti i campi obbligatori");
//       return;
//     }

//     let imageUrl = formData.image;

//     try {
//       if (imageFile) {
//         const formDataFile = new FormData();
//         formDataFile.append("image", imageFile);

//         const res = await fetch("http://localhost:3000/events/upload", {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formDataFile,
//         });

//         if (!res.ok) throw new Error("Errore upload immagine");

//         const data = await res.json();
//         imageUrl = data.url;
//       }

//       await onSubmit({
//         ...formData,
//         image: imageUrl,
//       });
//     } catch (err: any) {
//       console.error("Errore form:", err);

//       if (err.status === 400) {
//         toast.error("Compila tutti i campi obbligatori");
//       } else {
//         toast.error("Errore durante il salvataggio");
//       }
//     }
//   };

//   const EVENT_TYPES = ["Battle", "Workshop", "Concorso Coreografico"];

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">

//       {/* TITOLO */}
//       <div>
//         <label className="block font-medium">Titolo</label>
//         <input
//           type="text"
//           className={`border p-2 w-full ${errors.title ? "border-red-500" : ""}`}
//           value={formData.title}
//           onChange={(e) => handleChange("title", e.target.value)}
//         />
//         {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
//       </div>

//       {/* TIPOLOGIE EVENTO */}
//       <div>
//         <label className="block font-medium">Tipologie evento</label>

//         <div className="flex flex-col gap-1 mt-1">
//           {EVENT_TYPES.map((type) => (
//             <label key={type} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.eventTypes.includes(type)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     handleChange("eventTypes", [...formData.eventTypes, type]);
//                   } else {
//                     handleChange(
//                       "eventTypes",
//                       formData.eventTypes.filter((t) => t !== type)
//                     );
//                   }
//                 }}
//               />
//               {type}
//             </label>
//           ))}
//         </div>

//         {errors.eventTypes && (
//           <p className="text-red-600 text-sm">{errors.eventTypes}</p>
//         )}
//       </div>

//       {/* DATA */}
//       <div>
//         <label className="block font-medium">Data</label>
//         <input
//           type="date"
//           className={`border p-2 w-full ${errors.date ? "border-red-500" : ""}`}
//           value={formData.date}
//           min={new Date().toISOString().split("T")[0]}
//           onChange={(e) => handleChange("date", e.target.value)}
//         />
//         {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
//       </div>

//       {/* REGIONE */}
//       <div>
//         <label className="block font-medium">Regione</label>
//         <select
//           className={`border p-2 w-full ${errors.region ? "border-red-500" : ""}`}
//           value={formData.region}
//           onChange={(e) => handleChange("region", e.target.value)}
//         >
//           <option value="">Seleziona una regione</option>
//           {REGIONS.map((r) => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>
//         {errors.region && <p className="text-red-600 text-sm">{errors.region}</p>}
//       </div>

//       {/* CITTÀ */}
//       <div>
//         <label className="block font-medium">Città</label>
//         <input
//           type="text"
//           className={`border p-2 w-full ${errors.city ? "border-red-500" : ""}`}
//           value={formData.city}
//           onChange={(e) => handleChange("city", e.target.value)}
//         />
//         {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
//       </div>

//       {/* CATEGORIA */}
//       <div>
//         <label className="block font-medium">Categoria</label>
//         <input
//           type="text"
//           className={`border p-2 w-full ${errors.category ? "border-red-500" : ""}`}
//           value={formData.category}
//           onChange={(e) => handleChange("category", e.target.value)}
//         />
//         {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
//       </div>

//       {/* DESCRIZIONE */}
//       <div>
//         <label className="block font-medium">Descrizione</label>
//         <textarea
//           className={`border p-2 w-full ${errors.description ? "border-red-500" : ""}`}
//           value={formData.description}
//           onChange={(e) => handleChange("description", e.target.value)}
//         />
//         {errors.description && (
//           <p className="text-red-600 text-sm">{errors.description}</p>
//         )}
//       </div>

//       {/* IMMAGINE */}
//       <div className="flex flex-col gap-2">
//         <label className="block font-medium">Immagine evento</label>

//         <label
//           className={`cursor-pointer px-4 py-2 rounded w-fit transition
//             ${errors.image ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
//           `}
//         >
//           Carica immagine
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0] || null;
//               setImageFile(file);

//               if (file) {
//                 const previewUrl = URL.createObjectURL(file);
//                 setPreview(previewUrl);
//                 setErrors((prev) => ({ ...prev, image: "" }));
//               }
//             }}
//           />
//         </label>

//         {errors.image && (
//           <p className="text-red-600 text-sm">{errors.image}</p>
//         )}

//         {preview && (
//           <img
//             src={preview}
//             alt="Anteprima immagine"
//             className={`mt-2 w-full max-h-64 object-cover rounded border ${
//               errors.image ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//         )}
//       </div>

//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         {submitLabel}
//       </button>
//     </form>
//   );
// }
