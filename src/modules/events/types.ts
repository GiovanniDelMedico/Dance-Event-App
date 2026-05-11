// Tipo principale dell'evento
export interface Event {
  id: number;
  title: string;
  description: string;

  startDate: string;   // ISO string
  endDate: string;     // ISO string

  region: string;
  city: string;
  category: string;
  image: string | null;
  eventTypes: string[];

  creatorId: number;

  createdAt: string;
  updatedAt: string;

  creator: {
    id: number;
    nickname: string;
    avatarUrl?: string | null;
  };
}


// Tipo usato per creare o modificare un evento
export interface EventFormData {
  title: string;
  description: string;

  startDate: string;   // ISO string
  endDate: string;     // ISO string

  region: string;
  city: string;
  category: string;
  image?: string | null;
  eventTypes: string[];
}


// Tipo per una registrazione a un evento
export interface EventRegistration {
  id: number;
  userId: number;
  eventId: number;
  createdAt: string;
}
