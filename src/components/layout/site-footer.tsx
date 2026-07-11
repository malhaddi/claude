import Link from "next/link";
import { Sparkles } from "lucide-react";

import { navLinks, siteDescription, siteName } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
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

          <nav aria-label="Liens du site">
            <p className="text-sm font-semibold text-slate-900">Produit</p>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-slate-900">Compte</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Commencer
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Connexion
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-sm font-semibold text-slate-900">Légal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Mentions légales (à venir)</li>
              <li>Politique de confidentialité (à venir)</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
