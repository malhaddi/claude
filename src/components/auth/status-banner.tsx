import { AlertCircle, Info } from "lucide-react";

import { cx } from "@/lib/utils";

/** Small notice banner shown above the login form based on a ?status= value. */
export function StatusBanner({
  text,
  variant = "info",
}: {
  text: string;
  variant?: "info" | "error";
}) {
  const isError = variant === "error";
  const Icon = isError ? AlertCircle : Info;
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cx(
        "mb-5 flex items-start gap-2 rounded-lg border p-3 text-sm",
        isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {text}
    </div>
  );
}
