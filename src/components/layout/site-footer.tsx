import Link from "next/link";
import { Sparkles } from "lucide-react";

import {
  footerGroups,
  footerLegalNote,
  footerPlaceholders,
  footerPlaceholderTitle,
  siteDescription,
  siteName,
} from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="size-3.5" aria-hidden="true" />
              </span>
              {siteName}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              {siteDescription}
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold text-slate-900">
                {group.title}
              </p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {footerPlaceholderTitle}
            </p>
            <ul className="mt-3 space-y-2">
              {footerPlaceholders.map((label) => (
                <li key={label} className="text-sm text-slate-400">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-500">{footerLegalNote}</p>
        <p className="mt-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
