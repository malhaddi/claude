/**
 * Joins class names, skipping falsy values.
 * Lightweight alternative to clsx for simple conditional classes.
 */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
