export function tnd(amount: number, opts: { signed?: boolean; decimals?: number } = {}) {
  const { signed = false, decimals = 3 } = opts
  const formatted = new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount))
  const sign = amount < 0 ? '−' : signed ? '+' : ''
  return `${sign}${formatted} DT`
}

export function tndShort(amount: number) {
  return tnd(amount, { decimals: 0 })
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/** Mensualité d'un crédit à annuités constantes. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

/** Valeur acquise d'une épargne mensuelle à intérêts composés. */
export function savingsFutureValue(initial: number, monthly: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12
  const growth = Math.pow(1 + r, months)
  const fromInitial = initial * growth
  const fromMonthly = r === 0 ? monthly * months : monthly * ((growth - 1) / r)
  return fromInitial + fromMonthly
}
