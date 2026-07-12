import { cx } from "@/lib/utils";
import { researchContent } from "@/lib/projects/research-content";

/** Labelled native select for a controlled option list (stable values). */
export function SelectField({
  id,
  name,
  label,
  options,
  defaultValue,
  optional = false,
  error,
}: {
  id: string;
  name: string;
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  defaultValue?: string | null;
  optional?: boolean;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-slate-400">
            {researchContent.optional}
          </span>
        ) : null}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cx(
          "mt-1.5 block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:outline-2 focus:outline-offset-0",
          error
            ? "border-rose-400 focus:outline-rose-500"
            : "border-slate-300 focus:outline-indigo-600",
        )}
      >
        <option value="">{researchContent.selectPlaceholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
