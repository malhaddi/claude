import { cx } from "@/lib/utils";

/**
 * Primary submit button that disables itself while its form action is pending.
 * Disabling on `pending` is what prevents a double submission and keeps the
 * button in a disabled state for the duration of the request. Presentational
 * and easy to unit-test (pass `pending` directly).
 */
export function SubmitButton({
  pending,
  idleLabel,
  pendingLabel,
  className,
}: {
  pending: boolean;
  idleLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cx(
        "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
