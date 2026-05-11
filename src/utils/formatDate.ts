export function formatEventDate(start: string, end: string): string {
  if (!start || !end) return "";

  const s = new Date(start);
  const e = new Date(end);

  const sameDay =
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth() &&
    s.getDate() === e.getDate();

  // Evento di 1 giorno
  if (sameDay) {
    return s.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Evento multi-giorno
  const startFormatted = s.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const endFormatted = e.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${startFormatted} → ${endFormatted}`;
}
