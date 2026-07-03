/** Demo exchange-rate table (TND per unit). In production this would be
 *  fed by the trading-room feed / BCT reference rates. */
export const BASE_RATES: Record<
  string,
  { name: string; flag: string; buy: number; sell: number }
> = {
  EUR: { name: "Euro", flag: "🇪🇺", buy: 3.398, sell: 3.462 },
  USD: { name: "Dollar américain", flag: "🇺🇸", buy: 3.102, sell: 3.168 },
  GBP: { name: "Livre sterling", flag: "🇬🇧", buy: 3.951, sell: 4.038 },
  CHF: { name: "Franc suisse", flag: "🇨🇭", buy: 3.492, sell: 3.561 },
  CAD: { name: "Dollar canadien", flag: "🇨🇦", buy: 2.276, sell: 2.331 },
  JPY: { name: "Yen japonais (100)", flag: "🇯🇵", buy: 2.081, sell: 2.139 },
  SAR: { name: "Riyal saoudien", flag: "🇸🇦", buy: 0.824, sell: 0.847 },
  AED: { name: "Dirham émirati", flag: "🇦🇪", buy: 0.842, sell: 0.865 },
  QAR: { name: "Riyal qatari", flag: "🇶🇦", buy: 0.849, sell: 0.872 },
  DZD: { name: "Dinar algérien (100)", flag: "🇩🇿", buy: 2.301, sell: 2.393 },
};

/** Deterministic day-seeded jitter so rates look "live" but stay stable
 *  within a day and never drift far from the base. */
export function todaysRates(now = new Date()) {
  const seed =
    now.getUTCFullYear() * 372 + (now.getUTCMonth() + 1) * 31 + now.getUTCDate();
  const jitter = (i: number) => {
    const x = Math.sin(seed * 97 + i * 131) * 10000;
    return (x - Math.floor(x) - 0.5) * 0.006; // ±0.3%
  };
  return Object.entries(BASE_RATES).map(([code, r], i) => ({
    code,
    name: r.name,
    flag: r.flag,
    buy: +(r.buy * (1 + jitter(i))).toFixed(4),
    sell: +(r.sell * (1 + jitter(i + 50))).toFixed(4),
  }));
}
