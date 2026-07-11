"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { navLinks, siteName } from "@/lib/content";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-900"
          onClick={closeMenu}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">
            Adverto<span className="text-indigo-600">AI</span>
            <span className="sr-only">{siteName} — accueil</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/dashboard" variant="ghost">
            Connexion
          </ButtonLink>
          <ButtonLink href="/dashboard">Commencer</ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          </span>
          {menuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Navigation mobile"
          className="border-t border-slate-200 bg-white px-4 pt-2 pb-4 md:hidden"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
            <ButtonLink href="/dashboard" variant="secondary">
              Connexion
            </ButtonLink>
            <ButtonLink href="/dashboard">Commencer</ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
