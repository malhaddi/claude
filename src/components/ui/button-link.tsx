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

/** Link styled as a button — the marketing site only navigates, never submits. */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: ButtonLinkVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
