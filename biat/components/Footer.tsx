import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Particuliers",
    links: [
      { label: "Comptes & Packs", href: "/particuliers#comptes" },
      { label: "Cartes bancaires", href: "/cartes" },
      { label: "Crédits", href: "/particuliers#credits" },
      { label: "Épargne & Placements", href: "/particuliers#epargne" },
      { label: "Jeunes & Étudiants", href: "/particuliers#jeunes" },
    ],
  },
  {
    title: "Entreprises",
    links: [
      { label: "Cash Management", href: "/entreprises#cash" },
      { label: "MyBIAT Corporate", href: "/entreprises#corporate" },
      { label: "Financements", href: "/entreprises#financement" },
      { label: "Commerce international", href: "/entreprises#international" },
    ],
  },
  {
    title: "Outils",
    links: [
      { label: "Simulateurs de crédit", href: "/simulateurs" },
      { label: "Cours de change", href: "/#change" },
      { label: "Trouver une agence", href: "/agences" },
      { label: "Ouvrir un compte", href: "/ouvrir-un-compte" },
    ],
  },
  {
    title: "Le groupe",
    links: [
      { label: "Fondation BIAT", href: "/#fondation" },
      { label: "Assurances BIAT", href: "/particuliers#assurance" },
      { label: "Tunisie Valeurs", href: "/entreprises#capitaux" },
      { label: "BIAT France (TRE)", href: "/particuliers#tre" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Prêt à rejoindre la première banque de Tunisie ?
            </h2>
            <p className="mt-2 text-white/70">
              Ouvrez votre compte en ligne en 10 minutes — sans vous déplacer.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/ouvrir-un-compte"
              className="rounded-full bg-accent-500 px-6 py-3 font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
            >
              Ouvrir un compte
            </Link>
            <Link
              href="/agences#rdv"
              className="rounded-full border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {SITE.fullName}. Depuis 1976, {SITE.slogan.toLowerCase()}.
          </p>
          <p className="mt-4 text-sm text-white/60">{SITE.address}</p>
          <p className="tnum mt-1 text-sm font-semibold text-white/80">{SITE.phone}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BIAT sur Facebook"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent-500"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white" aria-hidden>
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V5c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.6v3H11v7h2.5z" />
              </svg>
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BIAT sur LinkedIn"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent-500"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white" aria-hidden>
                <path d="M6.9 8.6H4V20h2.9V8.6zM5.4 7.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM20 13.4c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V8.6H10V20h2.9v-6.1c0-1.6.7-2.5 2-2.5 1.2 0 1.9.8 1.9 2.5V20H20v-6.6z" />
              </svg>
            </a>
          </div>
        </div>

        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
              {col.title}
            </p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/45 md:flex-row">
          <p>
            © {new Date().getFullYear()} BIAT — {SITE.fullName}. Banque agréée par la Banque
            Centrale de Tunisie.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="#" className="hover:text-white/80">Mentions légales</a>
            <a href="#" className="hover:text-white/80">Tarifs & conditions</a>
            <a href="#" className="hover:text-white/80">Protection des données</a>
            <a href="#" className="hover:text-white/80">Réclamations</a>
          </p>
        </div>
        <p className="pb-5 text-center text-[10px] text-white/30">
          Maquette de démonstration — refonte proposée du site biat.com.tn. Données produits et taux
          purement indicatifs.
        </p>
      </div>
    </footer>
  );
}
