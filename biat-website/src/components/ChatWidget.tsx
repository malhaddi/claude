import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/format'

interface Msg {
  from: 'bot' | 'user'
  text: string
  link?: { to: string; label: string }
}

const answers: Array<{ match: RegExp; text: string; link?: { to: string; label: string } }> = [
  { match: /carte|card/i, text: 'Nous proposons 4 cartes, de la Carte Jeune gratuite à la Visa Infinite. Vous pouvez les comparer en détail et choisir celle qui vous ressemble.', link: { to: '/cartes', label: 'Comparer les cartes' } },
  { match: /cr[eé]dit|pr[eê]t|immobilier|auto|voiture/i, text: 'Nos crédits immobilier, auto et consommation démarrent à 8,2 %. Le simulateur calcule votre mensualité en 30 secondes, sans engagement.', link: { to: '/credits#simulateur', label: 'Simuler mon crédit' } },
  { match: /[eé]pargne|placement|d[eé]p[oô]t/i, text: 'Compte Épargne à 7 %, Plan Épargne Projet à 7,8 % et Dépôts à Terme jusqu’à 8,5 % : votre argent travaille pour vous.', link: { to: '/particuliers#epargne', label: 'Voir l’épargne' } },
  { match: /compte|ouvrir|devenir client|inscription/i, text: 'Vous pouvez ouvrir votre compte en ligne en 8 minutes : identité, coordonnées, choix du pack, et c’est parti.', link: { to: '/devenir-client', label: 'Ouvrir mon compte' } },
  { match: /agence|adresse|o[uù]|dab|gab/i, text: 'La BIAT compte 205 agences dans les 24 gouvernorats. Notre localisateur vous trouve la plus proche, avec horaires et services.', link: { to: '/agences', label: 'Trouver une agence' } },
  { match: /app|mybiat|mobile|t[eé]l[eé]phone/i, text: 'MyBIAT vous permet de consulter vos comptes, faire des virements instantanés et piloter vos cartes. Essayez la démo interactive !', link: { to: '/mybiat', label: 'Essayer MyBIAT' } },
  { match: /taux|change|euro|dollar|devise/i, text: 'Les taux de change indicatifs du jour sont affichés sur notre page d’accueil et mis à jour chaque matin à 8 h 30.', link: { to: '/', label: 'Voir les taux' } },
  { match: /contact|conseiller|t[eé]l|appel|r[eé]clamation/i, text: 'Nos conseillers répondent au 71 340 733, du lundi au vendredi de 8 h à 17 h. Vous pouvez aussi écrire via le formulaire de contact.', link: { to: '/contact', label: 'Nous contacter' } },
]

const fallback: Msg = {
  from: 'bot',
  text: 'Je peux vous renseigner sur les cartes, les crédits, l’épargne, l’ouverture de compte, les agences ou l’app MyBIAT. Que cherchez-vous ?',
}

const suggestions = ['Comparer les cartes', 'Simuler un crédit', 'Ouvrir un compte', 'Trouver une agence']

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: 'Bonjour 👋 Je suis l’assistant BIAT. Comment puis-je vous aider aujourd’hui ?' },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open])

  function send(text: string) {
    const q = text.trim()
    if (!q) return
    const hit = answers.find((a) => a.match.test(q))
    setMsgs((m) => [
      ...m,
      { from: 'user', text: q },
      hit ? { from: 'bot', text: hit.text, link: hit.link } : fallback,
    ])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer l’assistant' : 'Ouvrir l’assistant BIAT'}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-navy-900 p-4 text-white shadow-lift transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-navy-950/10"
            role="dialog"
            aria-label="Assistant BIAT"
          >
            <div className="bg-navy-900 px-5 py-4 text-white">
              <p className="font-display font-bold">Assistant BIAT</p>
              <p className="text-xs text-navy-200">Réponses instantanées, 24/7</p>
            </div>

            <div ref={bodyRef} className="scroll-slim flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      m.from === 'user' ? 'bg-navy-900 text-white rounded-br-md' : 'bg-navy-50 text-navy-950 rounded-bl-md',
                    )}
                  >
                    {m.text}
                    {m.link && (
                      <Link to={m.link.to} className="mt-2 block font-semibold text-navy-700 underline underline-offset-2">
                        {m.link.label} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="flex items-center gap-2 border-t border-navy-950/8 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre question…"
                className="flex-1 rounded-full bg-navy-50 px-4 py-2.5 text-sm outline-none placeholder:text-navy-950/40 focus:ring-2 focus:ring-navy-400"
              />
              <button
                type="submit"
                aria-label="Envoyer"
                className="rounded-full bg-flame-500 p-2.5 text-white transition-colors hover:bg-flame-600"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
