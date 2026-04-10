export interface CreateEventBody {
  title: string;
  eventTypes: string[];
  description: string;
  date: string;
  region: string;
  city: string;
  category: string;
  image: string;
  // creatorId lo aggiungeremo quando avremo login
}

export interface UpdateEventBody {
  title?: string;
  eventTypes?: string[];
  description?: string;
  date?: string;
  region?: string;
  city?: string;
  category?: string;
  image?: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
