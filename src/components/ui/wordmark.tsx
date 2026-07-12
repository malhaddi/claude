import { cx } from "@/lib/utils";
import { siteName } from "@/lib/content";

/**
 * Publy text wordmark. Colour and weight are inherited from the parent so it
 * fits header, auth and dashboard chrome; the trailing dot uses the Electric
 * accent. `siteName` provides the accessible name.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("text-lg font-bold tracking-tight", className)}>
      Publy
      <span className="text-indigo-600" aria-hidden="true">
        .
      </span>
      <span className="sr-only">{siteName}</span>
    </span>
  );
}
