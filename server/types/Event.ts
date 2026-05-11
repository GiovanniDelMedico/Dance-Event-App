export interface Event {
  id: number;
  eventTypes: string[];
  title: string;
  description: string;

  startDate: string;   // ISO string
  endDate: string;     // ISO string

  region: string;
  city: string;
  category: string;
  image: string | null;

  createdAt: string;
  updatedAt: string;

  creatorId: number;
}
