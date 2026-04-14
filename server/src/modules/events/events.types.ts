export interface CreateEventBody {
  title: string;
  description: string;
  date: string; // ISO string
  region: string;
  city: string;
  category: string;
  image: string;
  eventTypes: string[]; // array di tipologie
}

export interface UpdateEventBody {
  title?: string;
  description?: string;
  date?: string;
  region?: string;
  city?: string;
  category?: string;
  image?: string;
  eventTypes?: string[];
}

export interface EventFilters {
  region?: string;
  city?: string;
  category?: string;
  date?: string;
  eventType?: string;
}
