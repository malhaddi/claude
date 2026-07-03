/** BIAT wordmark + orange "élan" mark (inspired by the 2019 rebrand:
 *  navy wordmark, orange symbol evoking flight and momentum). */
export default function Logo({
  dark = false,
  className = "",
}: {
  dark?: boolean; // dark=true → for dark backgrounds (white wordmark)
  className?: string;
}) {
  const text = dark ? "#ffffff" : "#142657";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 34 34" className="h-8 w-8 shrink-0" aria-hidden>
        {/* rising wing strokes */}
        <path d="M4 26 Q14 24 27 8" fill="none" stroke="#f39200" strokeWidth="4.4" strokeLinecap="round" />
        <path d="M6 31 Q18 29 30 15" fill="none" stroke={dark ? "#8ec9ff" : "#1450e1"} strokeWidth="4.4" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span
          className="block text-[1.45rem] font-extrabold tracking-[0.06em]"
          style={{ color: text }}
        >
          BIAT
        </span>
        <span
          className="mt-0.5 block text-[0.5rem] font-semibold uppercase tracking-[0.14em]"
          style={{ color: dark ? "rgba(255,255,255,0.65)" : "#64748b" }}
        >
          Banque Internationale Arabe de Tunisie
        </span>
      </span>
    </span>
  );
}
