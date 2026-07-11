/**
 * French-locale formatting helpers.
 */

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats a whole-euro amount for French display, e.g. 39 -> "39 €". */
export function formatEur(amount: number): string {
  return eurFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Formats an ISO timestamp for French display, e.g. "11 juillet 2026".
 *  Returns an empty string for an unparseable value. */
export function formatDateFr(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
}
