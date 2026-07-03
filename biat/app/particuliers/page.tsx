import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BankCard from "@/components/BankCard";

export const metadata: Metadata = {
  title: "Particuliers",
  description:
    "Comptes, Pack FIRST, crédits BIATIMMO et CREDIAUTO, Épargne WLEDNA, bancassurance et offre TRE : la BIAT accompagne chaque moment de votre vie.",
};

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  tone?: "light" | "grey";
}) {
  return (
    <section id={id} className={`${tone === "grey" ? "bg-slate-50" : "bg-white"} scroll-mt-28 py-20`}>
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-accent-500">{eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{intro}</p>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function OfferCard({
  name,
  desc,
  points,
  cta = "En savoir plus",
  href = "/ouvrir-un-compte",
  badge,
}: {
  name: string;
  desc: string;
  points: string[];
  cta?: string;
  href?: string;
  badge?: string;
}) {
  return (
    <div className="relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {badge && (
        <span className="absolute right-5 top-5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {badge}
        </span>
      )}
      <h3 className="pr-20 text-lg font-extrabold text-slate-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {points.map((pt) => (
          <li key={pt} className="flex gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 text-accent-500">◆</span> {pt}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-5 text-sm font-bold text-brand-700 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}

export default function ParticuliersPage() {
  return (
    <>
      {/* hero */}
      <section className="mesh-hero relative overflow-hidden py-20 text-white">
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Particuliers
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Une banque pour chaque moment de votre vie.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-blue-100/85">
              Premier salaire, premier logement, études des enfants, retraite : plus de 205 agences
              et une app d&apos;exception pour vous accompagner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ouvrir-un-compte"
                className="rounded-full bg-accent-500 px-6 py-3 font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
              >
                Devenir client
              </Link>
              <Link
                href="/simulateurs"
                className="rounded-full border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Simuler un crédit
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150} className="hidden lg:block">
            <div className="animate-float">
              <BankCard variant="classic" holder="LEILA TRABELSI" className="mx-auto rotate-[-5deg]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comptes */}
      <SectionShell
        id="comptes"
        eyebrow="Au quotidien"
        title="Comptes & Packs — l'essentiel, sans friction."
        intro="Un compte qui s'ouvre en ligne, des packs pensés pour votre profil, et zéro paperasse inutile."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <OfferCard
              name="Compte Courant BIAT"
              desc="Le socle de votre vie financière, avec chéquier, carte et accès MyBIAT."
              points={["Ouverture en ligne en 10 min", "Virements instantanés inclus", "Découvert autorisé selon profil"]}
              badge="Best-seller"
            />
          </Reveal>
          <Reveal delay={80}>
            <OfferCard
              name="Pack FIRST"
              desc="Pour les jeunes actifs diplômés : tous les essentiels à tarif préférentiel."
              points={["Carte internationale incluse", "Taux préférentiels sur crédits", "Frais de tenue de compte réduits"]}
              badge="Jeunes actifs"
            />
          </Reveal>
          <Reveal delay={160}>
            <OfferCard
              name="Compte Épargne Prévoyance"
              desc="Une réserve disponible à tout moment, rémunérée dès le premier dinar."
              points={["Taux d'épargne attractif", "Versements libres", "Visible dans MyBIAT en temps réel"]}
            />
          </Reveal>
        </div>
      </SectionShell>

      {/* Crédits */}
      <SectionShell
        id="credits"
        eyebrow="Vos projets"
        title="Des crédits qui disent oui, vite."
        intro="Simulez en ligne, obtenez une réponse de principe immédiate avec Crédit By BIAT, signez en agence."
        tone="grey"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "BIATIMMO", desc: "Le crédit immobilier qui ouvre les portes de chez vous.", points: ["Jusqu'à 25 ans", "Financement jusqu'à 90 %", "FLEXIMMO : mensualités modulables"] },
            { name: "CREDIAUTO", desc: "Neuve ou d'occasion, prenez la route sans attendre.", points: ["Jusqu'à 25 000 DT", "Sur 7 ans maximum", "Réponse de principe immédiate"] },
            { name: "CREDIMEDIA", desc: "Équipez-vous : high-tech, électroménager, mobilier.", points: ["De 1 000 à 30 000 DT", "Jusqu'à 5 ans", "100 % en ligne"] },
            { name: "Avan'Salaire", desc: "Une avance sur salaire pour les imprévus du quotidien.", points: ["Déblocage en 24 h", "Remboursement flexible", "Sans justificatif d'achat"] },
          ].map((c, i) => (
            <Reveal key={c.name} delay={i * 70}>
              <OfferCard {...c} cta="Simuler" href="/simulateurs" />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Épargne */}
      <SectionShell
        id="epargne"
        eyebrow="Votre avenir"
        title="Épargner pour ce qui compte vraiment."
        intro="Des solutions pour chaque horizon : les études des enfants, un projet à cinq ans ou un patrimoine à transmettre."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <OfferCard
              name="Épargne WLEDNA"
              desc="Le plan d'épargne dédié aux études et à l'avenir de vos enfants."
              points={["Versements programmés dès 20 DT/mois", "Capital disponible à leurs 18 ans", "Bonus de fidélité BIAT"]}
              badge="Familles"
            />
          </Reveal>
          <Reveal delay={80}>
            <OfferCard
              name="Compte Épargne en Actions (CEA)"
              desc="Investissez en bourse de Tunis avec un cadre fiscal avantageux."
              points={["Avantage fiscal jusqu'à 50 000 DT", "Géré avec Tunisie Valeurs", "Suivi en temps réel"]}
            />
          </Reveal>
          <Reveal delay={160}>
            <OfferCard
              name="Placements à terme"
              desc="Comptes à terme et bons de caisse : un rendement connu d'avance."
              points={["Durées de 3 mois à 5 ans", "Taux fixés à la souscription", "Renouvellement automatique possible"]}
            />
          </Reveal>
        </div>
      </SectionShell>

      {/* Assurance */}
      <SectionShell
        id="assurance"
        eyebrow="Bancassurance"
        title="Assurances BIAT : protégés, quoi qu'il arrive."
        intro="Filiale d'assurance du groupe depuis 2002 — vos contrats vie, auto, habitation et santé gérés là où est votre argent."
        tone="grey"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Assurance Vie & Prévoyance", desc: "Protégez vos proches et préparez la transmission.", points: ["Capital garanti", "Fiscalité avantageuse", "Adossable à vos crédits"] },
            { name: "Auto & Habitation", desc: "Vos biens couverts, vos sinistres réglés vite.", points: ["Souscription en agence", "Assistance 24/7", "Déclaration depuis MyBIAT"] },
            { name: "Santé & Voyage", desc: "Partez l'esprit léger, en Tunisie comme à l'étranger.", points: ["Couverture internationale", "Rapatriement inclus", "Familles et étudiants"] },
          ].map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <OfferCard {...c} cta="Demander un devis" href="/agences#rdv" />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Jeunes */}
      <section id="jeunes" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 rounded-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-800 to-navy-900 p-10 text-white sm:p-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
                Jeunes & Étudiants · 13–25 ans
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                CHABEB : la première carte, la bonne habitude.
              </h2>
              <p className="mt-4 text-blue-100/85">
                Gratuite, rechargeable, pilotée depuis MyBIAT — et adossée à la Fondation BIAT qui
                accompagne la jeunesse tunisienne depuis 2014.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-blue-100/90">
                <li>✓ 0 DT de frais, retraits gratuits aux GAB BIAT</li>
                <li>✓ Rechargeable par les parents en un clic</li>
                <li>✓ Plafonds ajustables selon l&apos;âge</li>
                <li>✓ Passage automatique au Pack FIRST au premier emploi</li>
              </ul>
              <Link
                href="/ouvrir-un-compte"
                className="mt-8 inline-block rounded-full bg-accent-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
              >
                Commander la carte CHABEB
              </Link>
            </Reveal>
            <Reveal delay={150}>
              <div className="animate-float mx-auto max-w-sm">
                <BankCard variant="jeune" holder="YASMINE JEBALI" className="rotate-[5deg]" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRE */}
      <SectionShell
        id="tre"
        eyebrow="Tunisiens Résidents à l'Étranger"
        title="La Tunisie à portée de virement."
        intro="De Paris à Montréal, gérez vos comptes en dinars et en devises, financez vos projets au pays et gardez le lien — avec BIAT France à vos côtés."
        tone="grey"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Comptes en devises", desc: "Comptes en dinars convertibles ou en devises, sans obligation de rapatriement.", points: ["EUR, USD, GBP…", "Transferts famille simplifiés", "Gestion 100 % à distance via MyBIAT"] },
            { name: "Projet immobilier au pays", desc: "Financez votre résidence en Tunisie depuis l'étranger avec BIATIMMO.", points: ["Dossier constitué à distance", "Signature lors d'un séjour", "Accompagnement BIAT France"] },
            { name: "Épargne au pays", desc: "Faites fructifier vos économies en Tunisie en toute conformité.", points: ["Comptes à terme en devises", "Taux dédiés TRE", "Conseiller spécialisé"] },
          ].map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <OfferCard {...c} cta="Contacter un conseiller TRE" href="/agences#rdv" />
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
