import Link from "next/link";

import { cx } from "@/lib/utils";

const variants = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-slate-400",
  inverted:
    "bg-white text-indigo-700 shadow-sm hover:bg-indigo-50 focus-visible:outline-white",
} as const;

export type ButtonLinkVariant = keyof typeof variants;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Link styled as a button. When `href` is null the control renders as a
 * disabled `<button>` (used for the not-yet-available Growth plan / waitlist),
 * so it can never trigger navigation or a purchase.
 */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  disabledLabel,
}: {
  href: string | null;
  variant?: ButtonLinkVariant;
  className?: string;
  children: React.ReactNode;
  /** Accessible hint appended when disabled, e.g. "Bientôt disponible". */
  disabledLabel?: string;
}) {
  if (href === null) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={cx(
          baseClasses,
          "cursor-not-allowed bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200",
          className,
        )}
      >
        {children}
        {disabledLabel ? <span className="sr-only"> — {disabledLabel}</span> : null}
      </button>
    );
  }

  return (
    <Link href={href} className={cx(baseClasses, variants[variant], className)}>
      {children}
    </Link>
  );
}
