"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { authContent } from "@/lib/auth/content";
import { cx } from "@/lib/utils";

/**
 * Password input with a show/hide visibility toggle. The toggle is a
 * `type="button"` so it never submits the form, exposes an accessible
 * label + aria-pressed, and does not persist the revealed value anywhere.
 */
export function PasswordInput({
  id,
  name,
  label,
  autoComplete,
  hint,
  error,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
  hint?: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const hintId = useId();
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            "block w-full rounded-lg border bg-white py-2.5 pr-11 pl-3 text-sm text-slate-900 shadow-sm transition-colors focus:outline-2 focus:outline-offset-0",
            error
              ? "border-rose-400 focus:outline-rose-500"
              : "border-slate-300 focus:outline-indigo-600",
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={
            visible ? authContent.shared.hidePassword : authContent.shared.showPassword
          }
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
