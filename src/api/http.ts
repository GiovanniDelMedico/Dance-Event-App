export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function http<T>(
  endpoint: string,
  { token, headers, ...options }: RequestOptions = {}
): Promise<T> {
  // Forziamo i headers a essere un oggetto indicizzabile
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  if (!res.ok) {
    let message = "Errore nella richiesta";

    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {
      // risposta non JSON → manteniamo messaggio generico
    }

    throw new Error(message);
  }

  // DELETE 204 → nessun contenuto
  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}
