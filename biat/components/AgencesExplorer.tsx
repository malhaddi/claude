"use client";

import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import { REGIONS, type Branch } from "@/lib/branches";

export default function AgencesExplorer() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // RDV form state
  const [rdv, setRdv] = useState({ name: "", email: "", phone: "", subject: "Rendez-vous conseiller", message: "" });
  const [rdvStatus, setRdvStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (region) params.set("region", region);
        const res = await fetch(`/api/agences?${params}`, { signal: controller.signal });
        const data = await res.json();
        setBranches(data.agences);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q, region]);

  const count = useMemo(() => branches.length, [branches]);

  const submitRdv = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setRdvStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rdv),
      });
      const data = await res.json();
      setRdvStatus(res.ok ? { ok: true, msg: data.message } : { ok: false, msg: data.error });
      if (res.ok) setRdv({ name: "", email: "", phone: "", subject: "Rendez-vous conseiller", message: "" });
    } catch {
      setRdvStatus({ ok: false, msg: "Erreur réseau — veuillez réessayer." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* hero + search */}
      <section className="mesh-hero relative overflow-hidden pb-28 pt-20 text-white">
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Le plus grand réseau du pays
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              205+ agences. Toujours une près de chez vous.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-3xl bg-white p-2 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <span aria-hidden>🔍</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ville, quartier, nom d'agence…"
                  className="w-full py-3 text-slate-900 outline-none placeholder:text-slate-400"
                  aria-label="Rechercher une agence"
                />
              </div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                aria-label="Filtrer par région"
              >
                <option value="">Toutes les régions</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>
        </div>
      </section>

      {/* results */}
      <section className="bg-slate-50 pb-20">
        <div className="mx-auto -mt-12 max-w-7xl px-6">
          <p className="relative mb-5 text-sm font-semibold text-white/90">
            {loading ? "Recherche…" : `${count} agence${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""}`}
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((b) => (
              <div
                key={b.id}
                className={`flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                  b.flagship ? "border-accent-500/40 ring-2 ring-accent-500/10" : "border-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">{b.name}</h2>
                  {b.flagship && (
                    <span className="shrink-0 rounded-full bg-accent-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-600">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                  {b.city} · {b.region}
                </p>
                <p className="mt-3 text-sm text-slate-600">📍 {b.address}</p>
                <p className="tnum mt-1.5 text-sm font-semibold text-slate-700">☎ {b.phone}</p>
                <p className="mt-1.5 text-sm text-slate-500">🕐 {b.hours}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.services.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href="#rdv"
                  className="mt-5 inline-block text-sm font-bold text-brand-700 hover:underline"
                >
                  Prendre rendez-vous ici →
                </a>
              </div>
            ))}
            {!loading && branches.length === 0 && (
              <p className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
                Aucune agence ne correspond à votre recherche. Essayez une autre ville.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* RDV */}
      <section id="rdv" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
              Prendre rendez-vous
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Un conseiller. Un créneau. Zéro attente.
            </h2>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Dites-nous votre besoin — compte, crédit, épargne, entreprise — et un conseiller de
              l&apos;agence de votre choix vous rappelle sous 24 h ouvrées pour fixer le rendez-vous.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50">📞</span>
                <span>
                  <strong className="block text-slate-900">Par téléphone</strong>
                  <span className="tnum">(+216) 71 131 000</span> — du lundi au vendredi, 8h–17h
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50">📱</span>
                <span>
                  <strong className="block text-slate-900">Depuis MyBIAT</strong>
                  Rubrique « Mon conseiller » — messagerie sécurisée intégrée
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={submitRdv}
              className="rounded-3xl border border-slate-100 bg-slate-50/60 p-7 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Nom complet *
                  </label>
                  <input
                    required
                    value={rdv.name}
                    onChange={(e) => setRdv({ ...rdv, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    E-mail *
                  </label>
                  <input
                    required
                    type="email"
                    value={rdv.email}
                    onChange={(e) => setRdv({ ...rdv, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="vous@exemple.tn"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Téléphone
                  </label>
                  <input
                    value={rdv.phone}
                    onChange={(e) => setRdv({ ...rdv, phone: e.target.value })}
                    className="tnum w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="+216 …"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Objet
                  </label>
                  <select
                    value={rdv.subject}
                    onChange={(e) => setRdv({ ...rdv, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
                  >
                    {[
                      "Rendez-vous conseiller",
                      "Ouverture de compte",
                      "Crédit immobilier / auto / conso",
                      "Épargne & placements",
                      "Entreprise / professionnel",
                      "Autre demande",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Votre message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rdv.message}
                    onChange={(e) => setRdv({ ...rdv, message: e.target.value })}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="Décrivez votre besoin en quelques mots, et l'agence souhaitée…"
                  />
                </div>
              </div>

              {rdvStatus && (
                <p
                  role="status"
                  className={`mt-4 rounded-xl p-3.5 text-sm font-semibold ${
                    rdvStatus.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  {rdvStatus.ok ? "✓ " : "⚠ "}
                  {rdvStatus.msg}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-5 w-full rounded-full bg-accent-500 py-3.5 font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600 disabled:opacity-60"
              >
                {sending ? "Envoi en cours…" : "Demander à être rappelé"}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Vos données ne servent qu&apos;à traiter votre demande, conformément à la loi
                tunisienne sur la protection des données personnelles.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
