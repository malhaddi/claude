"use client";

import { useEffect, useState } from "react";

/** "Espace Client" — MyBIAT / MyBIAT Corporate login (démo). */
export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"particulier" | "corporate">("particulier");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSubmitted(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-navy-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Connexion Espace Client"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mesh-hero px-7 pb-5 pt-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Espace Client
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">MyBIAT</h2>
            </div>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex gap-1 rounded-full bg-white/10 p-1">
            {(
              [
                ["particulier", "Particulier"],
                ["corporate", "Corporate"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 rounded-full py-1.5 text-sm font-bold transition ${
                  tab === key ? "bg-white text-brand-800" : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-7 py-6">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">
                🔒
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">Site de démonstration</h3>
              <p className="mt-2 text-sm text-slate-600">
                Sur le site réel, vous seriez redirigé vers{" "}
                {tab === "corporate" ? "MyBIAT Corporate" : "MyBIAT"} avec authentification forte
                (mot de passe + OTP SMS).
              </p>
              <button
                onClick={onClose}
                className="mt-5 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
              >
                Compris
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {tab === "corporate" ? "Code entreprise" : "Identifiant"}
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  placeholder={tab === "corporate" ? "ENT-000000" : "Votre identifiant MyBIAT"}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Mot de passe
                </label>
                <input
                  required
                  type="password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-brand-700 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition hover:bg-brand-800"
              >
                Se connecter
              </button>
              <p className="text-center text-xs text-slate-500">
                <span className="mr-1">🔐</span> Connexion chiffrée · Authentification forte ·{" "}
                <a href="#" className="font-semibold text-brand-700 hover:underline">
                  Identifiant oublié ?
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
