import { useState } from 'react'
import { ChevronDown, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { Button, Container, PageHero, Reveal, SectionTitle } from '../components/ui'
import { cn } from '../lib/format'

const channels = [
  { icon: Phone, title: 'Par téléphone', desc: '71 340 733 — Lun–Ven, 8h à 17h', action: 'Appeler', href: 'tel:+21671340733' },
  { icon: MessageCircle, title: 'Assistant en ligne', desc: 'Réponses instantanées 24/7 via le chat en bas de page', action: 'Ouvrir le chat', href: '#' },
  { icon: MapPin, title: 'En agence', desc: '205 agences dans les 24 gouvernorats', action: 'Trouver une agence', href: '/agences' },
  { icon: Mail, title: 'Par écrit', desc: 'Réclamations traitées sous 48 h ouvrées', action: 'Écrire', href: '#formulaire' },
]

const faqs = [
  { q: 'Comment ouvrir un compte BIAT en ligne ?', a: 'Rendez-vous sur « Devenir client », munissez-vous de votre CIN et d’un justificatif de domicile, et suivez les 4 étapes. Le parcours prend environ 8 minutes ; la signature finale se fait en agence ou par visioconférence.' },
  { q: 'Que faire en cas de perte ou de vol de ma carte ?', a: 'Verrouillez immédiatement la carte depuis MyBIAT (Cartes → Verrouiller) — c’est instantané et réversible. Appelez ensuite le 71 340 733 pour faire opposition définitive si nécessaire.' },
  { q: 'Les virements MyBIAT sont-ils vraiment instantanés ?', a: 'Oui, les virements vers les banques tunisiennes participantes sont exécutés en quelques secondes, 24 h/24 et 7 j/7, y compris les jours fériés.' },
  { q: 'Comment déposer une réclamation ?', a: 'Via le formulaire ci-dessous, en agence, ou par courrier au siège. Vous recevez un accusé sous 24 h et une réponse sous 48 h ouvrées. Si le désaccord persiste, vous pouvez saisir le Médiateur bancaire.' },
  { q: 'Puis-je gérer mes comptes BIAT depuis l’étranger ?', a: 'Absolument. MyBIAT fonctionne partout dans le monde, et notre offre dédiée aux Tunisiens résidents à l’étranger inclut des conditions préférentielles sur les transferts.' },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-950/6">
          <button
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-semibold text-navy-950">{f.q}</span>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-navy-500 transition-transform', open === i && 'rotate-180')} />
          </button>
          <div
            className={cn(
              'grid transition-all duration-300',
              open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-5 text-sm leading-relaxed text-navy-950/65">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <>
      <PageHero
        eyebrow="Aide & contact"
        title="Une question ? Une vraie réponse."
        lede="Par chat, par téléphone, en agence ou par écrit : choisissez le canal qui vous convient, nous nous occupons du reste."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-3xl bg-sand-50 p-6 shadow-card ring-1 ring-navy-950/5">
                  <span className="w-fit rounded-2xl bg-navy-100 p-3 text-navy-800">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 font-display text-base font-bold text-navy-950">{c.title}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-navy-950/60">{c.desc}</p>
                  <a href={c.href} className="mt-4 text-sm font-bold text-navy-700 hover:underline underline-offset-2">
                    {c.action} →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="FAQ" title="Les questions qu’on nous pose le plus" />
            <Reveal className="mt-9">
              <Faq />
            </Reveal>
          </div>

          <div id="formulaire" className="scroll-mt-28">
            <SectionTitle eyebrow="Formulaire" title="Écrivez-nous" lede="Réponse garantie sous 48 h ouvrées." />
            <Reveal className="mt-9">
              {sent ? (
                <div className="rounded-3xl bg-mint-100 p-10 text-center">
                  <p className="font-display text-xl font-bold text-mint-600">Message envoyé ✓</p>
                  <p className="mt-2 text-sm text-navy-950/65">
                    Merci ! Un conseiller vous répondra sous 48 h ouvrées à l’adresse indiquée.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-4 rounded-3xl bg-white p-7 shadow-card ring-1 ring-navy-950/6"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Nom complet</span>
                      <input required className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500" placeholder="Ahmed Ben Salah" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Email</span>
                      <input required type="email" className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500" placeholder="vous@exemple.tn" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Sujet</span>
                    <select className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500">
                      <option>Information sur un produit</option>
                      <option>Réclamation</option>
                      <option>Ouverture de compte</option>
                      <option>Partenariat / Fondation</option>
                      <option>Autre</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Message</span>
                    <textarea required rows={5} className="w-full resize-none rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500" placeholder="Décrivez votre demande…" />
                  </label>
                  <Button type="submit" variant="flame" className="w-full">
                    <Send className="h-4 w-4" /> Envoyer le message
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
