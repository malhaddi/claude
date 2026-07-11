import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { authContent } from "@/lib/auth/content";
import { siteName } from "@/lib/content";

/** Centered card layout shared by the login and registration pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 self-start rounded text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {authContent.shared.backHome}
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">
            Adverto<span className="text-indigo-600">AI</span>
            <span className="sr-only">{siteName}</span>
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
    </main>
  );
}
