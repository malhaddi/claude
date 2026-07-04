import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface Account {
  id: string
  name: string
  iban: string
  balance: number
  kind: 'courant' | 'epargne'
}

export interface Tx {
  id: number
  label: string
  category: string
  date: string
  amount: number
  accountId: string
}

export interface DemoCard {
  id: string
  name: string
  network: string
  last4: string
  color: 'navy' | 'platinum' | 'coral' | 'black'
  frozen: boolean
  ecommerce: boolean
  weeklyLimit: number
  maxLimit: number
}

export interface Beneficiary {
  id: string
  name: string
  bank: string
  iban: string
}

interface DemoState {
  accounts: Account[]
  txs: Tx[]
  cards: DemoCard[]
  beneficiaries: Beneficiary[]
  transfer: (accountId: string, beneficiary: Beneficiary, amount: number, motif: string) => void
  toggleFrozen: (cardId: string) => void
  toggleEcommerce: (cardId: string) => void
  setLimit: (cardId: string, limit: number) => void
}

const initialAccounts: Account[] = [
  { id: 'cc', name: 'Compte courant', iban: 'TN59 0800 6003 5648 1200 3371', balance: 12845.3, kind: 'courant' },
  { id: 'ep', name: 'Compte Épargne BIAT', iban: 'TN59 0800 6003 5648 1200 4488', balance: 34210.5, kind: 'epargne' },
]

const initialTxs: Tx[] = [
  { id: 1, label: 'Salaire — STEG', category: 'Revenus', date: '01 juil.', amount: 2450, accountId: 'cc' },
  { id: 2, label: 'Carrefour La Marsa', category: 'Alimentation', date: '30 juin', amount: -86.4, accountId: 'cc' },
  { id: 3, label: 'Virement — Yasmine B.', category: 'Virements', date: '30 juin', amount: -300, accountId: 'cc' },
  { id: 4, label: 'Loyer — Résidence Jasmin', category: 'Logement', date: '28 juin', amount: -950, accountId: 'cc' },
  { id: 5, label: 'Ooredoo — Facture mobile', category: 'Abonnements', date: '27 juin', amount: -45, accountId: 'cc' },
  { id: 6, label: 'Bolt — 3 trajets', category: 'Transport', date: '26 juin', amount: -32.7, accountId: 'cc' },
  { id: 7, label: 'Pharmacie Centrale', category: 'Santé', date: '25 juin', amount: -28.9, accountId: 'cc' },
  { id: 8, label: 'Café Journal — L’Aouina', category: 'Loisirs', date: '24 juin', amount: -7.5, accountId: 'cc' },
  { id: 9, label: 'Monoprix Menzah 6', category: 'Alimentation', date: '23 juin', amount: -64.2, accountId: 'cc' },
  { id: 10, label: 'Virement reçu — Karim T.', category: 'Revenus', date: '22 juin', amount: 850, accountId: 'cc' },
  { id: 11, label: 'Épargne programmée', category: 'Épargne', date: '21 juin', amount: -400, accountId: 'cc' },
  { id: 12, label: 'Total Énergie — Carburant', category: 'Transport', date: '20 juin', amount: -95, accountId: 'cc' },
]

const initialCards: DemoCard[] = [
  { id: 'c1', name: 'Carte Essentielle', network: 'Visa', last4: '7890', color: 'navy', frozen: false, ecommerce: true, weeklyLimit: 2000, maxLimit: 4000 },
  { id: 'c2', name: 'Carte Premium', network: 'Visa Platinum', last4: '3321', color: 'platinum', frozen: false, ecommerce: false, weeklyLimit: 5000, maxLimit: 8000 },
]

const initialBeneficiaries: Beneficiary[] = [
  { id: 'b1', name: 'Yasmine Ben Ammar', bank: 'BIAT', iban: 'TN59 0800 6012 9921 0034 5510' },
  { id: 'b2', name: 'Karim Trabelsi', bank: 'Amen Bank', iban: 'TN59 0700 3105 5210 0784 2201' },
  { id: 'b3', name: 'Slim Gharbi', bank: 'Attijari Bank', iban: 'TN59 0400 1200 8834 6612 9905' },
]

/** Dépenses mensuelles (DT), janvier → juin 2026. */
export const monthlySpending = [
  { month: 'Jan', value: 2140 },
  { month: 'Fév', value: 1890 },
  { month: 'Mar', value: 2680 },
  { month: 'Avr', value: 2310 },
  { month: 'Mai', value: 1975 },
  { month: 'Juin', value: 2009.7 },
]

export const categorySpending = [
  { category: 'Logement', value: 950 },
  { category: 'Alimentation', value: 420.6 },
  { category: 'Épargne', value: 400 },
  { category: 'Transport', value: 127.7 },
  { category: 'Abonnements', value: 45 },
  { category: 'Autres', value: 66.4 },
]

const DemoContext = createContext<DemoState | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [txs, setTxs] = useState(initialTxs)
  const [cards, setCards] = useState(initialCards)

  const value = useMemo<DemoState>(
    () => ({
      accounts,
      txs,
      cards,
      beneficiaries: initialBeneficiaries,
      transfer(accountId, beneficiary, amount, motif) {
        setAccounts((accs) =>
          accs.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a)),
        )
        setTxs((t) => [
          {
            id: Date.now(),
            label: `Virement — ${beneficiary.name}${motif ? ` (${motif})` : ''}`,
            category: 'Virements',
            date: 'Aujourd’hui',
            amount: -amount,
            accountId,
          },
          ...t,
        ])
      },
      toggleFrozen(cardId) {
        setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)))
      },
      toggleEcommerce(cardId) {
        setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, ecommerce: !c.ecommerce } : c)))
      },
      setLimit(cardId, limit) {
        setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, weeklyLimit: limit } : c)))
      },
    }),
    [accounts, txs, cards],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
