import { cx } from "@/lib/utils";

/**
 * Labelled text/email input with accessible error wiring. Presentational —
 * used inside the client auth forms.
 */
export function AuthField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  defaultValue,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cx(
          "mt-1.5 block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0",
          error
            ? "border-rose-400 focus:outline-rose-500"
            : "border-slate-300 focus:outline-indigo-600",
        )}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
