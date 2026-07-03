"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import LoginModal from "./LoginModal";
import { NAV, SITE } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* ===== Utility bar ===== */}
        <div
          className={`bg-navy-900 text-white/80 transition-all duration-300 ${
            scrolled ? "h-0 overflow-hidden opacity-0" : "h-9 opacity-100"
          }`}
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6">
            <p className="hidden items-center gap-2 sm:flex">
              <span className="text-accent-500">●</span> {SITE.slogan} — la première banque de Tunisie
            </p>
            <div className="flex items-center gap-5">
              <Link href="/agences" className="transition hover:text-white">
                📍 Trouver une agence
              </Link>
              <Link href="/agences#rdv" className="hidden transition hover:text-white sm:block">
                🗓️ Prendre rendez-vous
              </Link>
              <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`} className="tnum font-semibold text-white/90 transition hover:text-white">
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>

        {/* ===== Main nav ===== */}
        <div
          className={`border-b transition-all duration-300 ${
            scrolled
              ? "border-slate-200/80 bg-white/85 shadow-lg shadow-navy-900/5 backdrop-blur-xl"
              : "border-white/10 bg-white/95 backdrop-blur"
          }`}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/" aria-label="BIAT — Accueil" onClick={() => setOpenMenu(null)}>
              <Logo />
            </Link>

            {/* desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setOpenMenu(item.columns ? item.label : null)}
                    onFocus={() => setOpenMenu(item.columns ? item.label : null)}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      pathname === item.href
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-brand-700"
                    }`}
                  >
                    {item.label}
                    {item.columns && (
                      <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition ${openMenu === item.label ? "rotate-180" : ""}`} aria-hidden>
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* right CTAs */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <button
                onClick={() => setLoginOpen(true)}
                className="rounded-full border border-brand-700/25 px-4 py-2 text-sm font-bold text-brand-700 transition hover:border-brand-700 hover:bg-brand-50"
              >
                Espace Client
              </button>
              <Link
                href="/ouvrir-un-compte"
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-accent-500/30 transition hover:bg-accent-600 hover:shadow-lg"
              >
                Ouvrir un compte
              </Link>
            </div>

            {/* mobile burger */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-current transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </nav>

          {/* ===== Mega menu (desktop) ===== */}
          {NAV.map(
            (item) =>
              item.columns &&
              openMenu === item.label && (
                <div
                  key={item.label}
                  className="absolute inset-x-0 hidden border-t border-slate-100 bg-white/97 shadow-2xl shadow-navy-900/10 backdrop-blur-xl lg:block"
                  onMouseEnter={() => setOpenMenu(item.label)}
                >
                  <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-8">
                    {item.columns.map((col) => (
                      <div key={col.title}>
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                          {col.title}
                        </p>
                        <ul className="space-y-1">
                          {col.links.map((l) => (
                            <li key={l.label}>
                              <Link
                                href={l.href}
                                onClick={() => setOpenMenu(null)}
                                className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-brand-50"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-base transition group-hover:bg-white">
                                  {l.icon}
                                </span>
                                <span>
                                  <span className="block text-sm font-bold text-slate-800 group-hover:text-brand-700">
                                    {l.label}
                                  </span>
                                  <span className="block text-xs text-slate-500">{l.desc}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>

        {/* ===== Mobile menu ===== */}
        <div
          className={`overflow-y-auto border-b border-slate-200 bg-white shadow-2xl transition-all duration-300 lg:hidden ${
            mobileOpen ? "max-h-[calc(100vh-68px)] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-base font-bold text-slate-800 transition hover:bg-brand-50"
                >
                  {item.label}
                </Link>
                {item.columns && (
                  <div className="ml-4 border-l-2 border-slate-100 pl-3">
                    {item.columns.flatMap((c) => c.links).map((l) => (
                      <Link
                        key={l.label}
                        href={l.href}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-brand-700"
                      >
                        {l.icon} {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setLoginOpen(true);
                }}
                className="flex-1 rounded-full border border-brand-700/25 px-4 py-3 text-center text-sm font-bold text-brand-700"
              >
                Espace Client
              </button>
              <Link
                href="/ouvrir-un-compte"
                className="flex-1 rounded-full bg-accent-500 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Ouvrir un compte
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* spacer for fixed header */}
      <div className="h-[68px] lg:h-[104px]" aria-hidden />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
