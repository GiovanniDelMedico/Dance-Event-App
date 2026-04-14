// import { useAuth } from "../context/AuthContext";

// type Props = {
//   onEdit: () => void;
//   onDelete: () => void;
//   stopPropagation?: boolean;
//   creatorId: number;
// };

// export default function EventActions({
//   onEdit,
//   onDelete,
//   stopPropagation = false,
//   creatorId,
// }: Props) {
//   const { user } = useAuth();

//   const isCreator = user && user.id === creatorId;
//   const isAdmin = user && user.role === "admin";
//   const canManage = isCreator || isAdmin;

//   if (!canManage) {
//     return null;
//   }

//   const handleClick =
//     (callback: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
//       if (stopPropagation) e.stopPropagation();
//       callback();
//     };

//   return (
//     <div className="flex gap-3">
//       <button
//         onClick={handleClick(onEdit)}
//         className="px-3 py-1 bg-yellow-500 text-white rounded"
//       >
//         Modifica
//       </button>

//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           if (confirm("Sei sicuro di voler eliminare questo evento?")) {
//             onDelete?.();
//           }
//         }}
//         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//       >
//         Elimina
//       </button>
//     </div>
//   );
// }
