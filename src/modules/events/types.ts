// Tipo principale dell'evento
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string
  region: string;
  city: string;
  category: string;
  image: string | null;
  eventTypes: string[]; // es: ["Battle", "Workshop"]
  creatorId: number;
}

// Tipo usato per creare o modificare un evento
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  region: string;
  city: string;
  category: string;
  image?: string | null; // URL immagine (dopo upload)
  eventTypes: string[];
}

// Tipo per una registrazione a un evento
export interface EventRegistration {
  id: number;
  userId: number;
  eventId: number;
  createdAt: string;
}
