export interface CreateEventBody {
  title: string;
  description: string;

  startDate: string; // ISO string
  endDate: string;   // ISO string

  region: string;
  city: string;
  category: string;
  image: string | null;

  eventTypes: string[];
}


export interface UpdateEventBody {
  title?: string;
  description?: string;

  startDate?: string;
  endDate?: string;

  region?: string;
  city?: string;
  category?: string;
  image?: string | null;

  eventTypes?: string[];
}


export interface EventFilters {
  region?: string;
  city?: string;
  category?: string;

  startDate?: string; // mostra eventi che iniziano dopo questa data
  endDate?: string;   // mostra eventi che finiscono prima di questa data

  eventType?: string;
}
