import { useAuth } from "../context/AuthContext";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  stopPropagation?: boolean;
  creatorId: number; // <--- AGGIUNTO: serve per capire se l'utente è il creatore
};

export default function EventActions({
  onEdit,
  onDelete,
  stopPropagation = false,
  creatorId,
}: Props) {
  const { user } = useAuth();

  // L’utente può modificare/eliminare solo se è il creatore
  const isOwner = user && user.id === creatorId;

  if (!isOwner) {
    return null; // <--- Nessun pulsante se non autorizzato
  }

  const handleClick =
    (callback: () => void) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (stopPropagation) e.stopPropagation();
      callback();
    };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleClick(onEdit)}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        Modifica
      </button>

      <button
        onClick={handleClick(onDelete)}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        Elimina
      </button>
    </div>
  );
}
