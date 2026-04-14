export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
