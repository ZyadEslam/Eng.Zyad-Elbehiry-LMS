/** Circular progress ring (SVG, no deps) */
export default function Ring({ pct, size = 120, stroke = 10, label, sub }: { pct: number; size?: number; stroke?: number; label?: string; sub?: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#eee" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E6292D" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none"><div><div className="text-2xl font-black" dir="ltr">{label ?? `${pct}%`}</div>{sub && <div className="mono mt-1 text-[10px] font-bold uppercase tracking-widest text-[#8a8a8a]">{sub}</div>}</div></div>
    </div>
  );
}
