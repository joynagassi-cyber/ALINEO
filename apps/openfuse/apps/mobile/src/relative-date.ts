/** Relative French timestamps for task, notification and conversation activity. */
export function relativeDate(value: string, now = Date.now()): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  const diff = now - parsed;
  if (diff < -60_000) return dayLabel(parsed);
  const elapsed = Math.max(0, diff);
  if (elapsed < 60_000) return "À l’instant";
  if (elapsed < 3600_000) return `il y a ${Math.floor(elapsed / 60_000)} min`;
  if (elapsed < 86400_000) return `il y a ${Math.floor(elapsed / 3600_000)} h`;
  return dayLabel(parsed);
}

function dayLabel(value: number): string {
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
