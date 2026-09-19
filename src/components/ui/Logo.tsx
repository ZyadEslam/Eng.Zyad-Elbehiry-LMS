export default function Logo({ size = 38, light = false }: { size?: number; light?: boolean }) {
  return (<div className="flex items-center gap-2.5">
    <div className="grid place-items-center rounded-lg bg-brand text-white font-mono font-black shadow-[0_6px_14px_rgba(230,41,45,.35)]" style={{ width: size, height: size, fontSize: size * 0.4 }}>{"</>"}</div>
    <div className="leading-tight"><div className={`font-extrabold text-[15px] ${light ? "text-white" : "text-[#222]"}`}>Eng. Zyad Elbehiry</div><div className={`text-[11px] font-semibold ${light ? "text-gray-400" : "text-[#5f6368]"}`} dir="ltr">Programming &amp; AI — Grade 11</div></div>
  </div>);
}
