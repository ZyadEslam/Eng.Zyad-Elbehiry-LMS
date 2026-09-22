export default function Logo({ size = 38, light = false }: { size?: number; light?: boolean }) {
  return (<div className="flex items-center gap-3">
    <div className="grid flex-none place-items-center rounded-[10px] bg-brand text-white shadow-[0_6px_14px_rgba(230,41,45,.35)]" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7 3 12l5 5" /><path d="m16 7 5 5-5 5" /><path d="M14 4 10 20" /></svg>
    </div>
    <div className="leading-[1.1]"><div className={`text-[15px] font-black tracking-tight ${light ? "text-white" : "text-[#111]"}`}>Eng. Zyad Elbehiry</div><div className={`mono text-[10.5px] font-semibold uppercase tracking-[.14em] ${light ? "text-gray-400" : "text-[#8a8a8a]"}`} dir="ltr">Programming &amp; AI · G11</div></div>
  </div>);
}
