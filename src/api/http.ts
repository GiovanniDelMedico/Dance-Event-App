export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RequestOptions extends RequestInit {
  token?: string;
  body?: any;
}

export async function http<T>(
  endpoint: string,
  { token, headers = {}, body, ...options }: RequestOptions = {}
): Promise<T> {
  const authToken = token || localStorage.getItem("token");

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Token
  if (authToken) {
    finalHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  let finalBody: BodyInit | undefined = undefined;

  // 🔥 Caso 1: FormData → NON impostare Content-Type
  if (body instanceof FormData) {
    finalBody = body;
  }

  // 🔥 Caso 2: JSON → aggiungi Content-Type
  else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!res.ok) {
    let message = "Errore nella richiesta";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}