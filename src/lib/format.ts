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
