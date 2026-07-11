import { cx } from "@/lib/utils";
import { projectsContent } from "@/lib/projects/content";

const inputClasses = (error?: string) =>
  cx(
    "mt-1.5 block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0",
    error
      ? "border-rose-400 focus:outline-rose-500"
      : "border-slate-300 focus:outline-indigo-600",
  );

/** Labelled input/textarea with accessible error + optional/hint metadata. */
export function FormField({
  id,
  name,
  label,
  type = "text",
  multiline = false,
  defaultValue,
  placeholder,
  hint,
  optional = false,
  required = false,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-slate-400">
            {projectsContent.form.optional}
          </span>
        ) : null}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          defaultValue={defaultValue ?? undefined}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(inputClasses(error), "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue ?? undefined}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClasses(error)}
        />
      )}

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
