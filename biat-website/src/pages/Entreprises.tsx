import { Building2, Container as ContainerIcon, Globe2, Landmark, Leaf, LineChart, Truck, Users } from 'lucide-react'
import { Button, Container, PageHero, Reveal, SectionTitle } from '../components/ui'

const offers = [
  {
    id: 'financement',
    icon: Landmark,
    title: 'Financement',
    desc: 'Crédits d’investissement, cycle d’exploitation, leasing : des solutions calibrées à la taille de votre entreprise, de la TPE au grand groupe.',
    points: ['Crédit d’investissement jusqu’à 12 ans', 'Facilités de caisse & escompte', 'Leasing mobilier et immobilier'],
  },
  {
    id: 'international',
    icon: Globe2,
    title: 'Commerce international',
    desc: 'Première banque tunisienne à l’international : crédits documentaires, remises, change et couverture de risque pour vos flux import-export.',
    points: ['Crédits documentaires import/export', 'Couverture de change à terme', 'Réseau de 1 400 banques correspondantes'],
  },
  {
    id: 'cash',
    icon: LineChart,
    title: 'Cash management',
    desc: 'BIATNET Corporate centralise vos comptes, vos virements de masse et vos paiements fournisseurs avec des workflows de validation sur mesure.',
    points: ['Virements de masse & salaires', 'Workflows multi-signataires', 'Reporting temps réel multi-comptes'],
  },
  {
    id: 'monetique',
    icon: Users,
    title: 'Monétique & encaissement',
    desc: 'TPE nouvelle génération, paiement en ligne et QR code : encaissez partout, suivez tout depuis un tableau de bord unique.',
    points: ['TPE 4G & sans contact', 'Passerelle e-commerce sécurisée', 'Encaissement par QR dinar digital'],
  },
]

export function Entreprises() {
  return (
    <>
      <PageHero
        eyebrow="Entreprises & Professionnels"
        title="Le partenaire bancaire des entreprises qui font la Tunisie."
        lede="De l’artisan au groupe exportateur : un chargé d’affaires dédié, des circuits de décision courts et la première salle des marchés du pays."
      >
        <div className="flex flex-wrap gap-4">
          <Button to="/contact" variant="flame" size="lg" arrow>Parler à un chargé d’affaires</Button>
          <Button to="/mybiat" variant="white" size="lg">Découvrir BIATNET</Button>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Nos expertises"
            title="Quatre métiers, un interlocuteur unique."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.07}>
                <div id={o.id} className="scroll-mt-28 flex h-full flex-col rounded-3xl bg-sand-50 p-8 shadow-card ring-1 ring-navy-950/5">
                  <span className="w-fit rounded-2xl bg-navy-100 p-3 text-navy-800">
                    <o.icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-bold text-navy-950">{o.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-950/60">{o.desc}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-navy-950/75">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-flame-500" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Green financing banner */}
      <section className="bg-sand-50 pb-20 sm:pb-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-9 text-white sm:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mint-500/15 blur-3xl" />
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
                    <Leaf className="h-4 w-4" /> Transition énergétique
                  </p>
                  <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold sm:text-3xl">
                    500 millions de dinars pour les PME qui investissent dans le durable.
                  </h2>
                  <p className="mt-3 max-w-xl text-navy-200">
                    Photovoltaïque, efficacité énergétique, modernisation industrielle : bonification de taux
                    et accompagnement technique inclus.
                  </p>
                </div>
                <Button to="/contact" variant="white" size="lg" arrow>Déposer un projet</Button>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Building2, stat: '1er', label: 'banquier des PME tunisiennes' },
              { icon: ContainerIcon, stat: '30 %', label: 'du commerce extérieur du pays accompagné' },
              { icon: Truck, stat: '48 h', label: 'pour une réponse sur vos facilités courantes' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-950/5">
                  <span className="rounded-xl bg-navy-100 p-2.5 text-navy-800">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-navy-900">{s.stat}</p>
                    <p className="text-xs text-navy-950/55">{s.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
