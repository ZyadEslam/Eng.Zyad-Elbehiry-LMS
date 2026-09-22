"use client";
import { useEffect, useState } from "react";
/** Sends a heartbeat every 30s and shows how many users are online right now. */
export default function Presence({ showList = false }: { showList?: boolean }) {
  const [online, setOnline] = useState<{ id: string; name: string; role: string }[]>([]);
  useEffect(() => {
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/presence/heartbeat", { method: "POST" }).catch(() => {});
      const r = await fetch("/api/presence/online").then((r) => r.json()).catch(() => null);
      if (r?.online) setOnline(r.online);
    };
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2 text-[13px] font-extrabold">
      <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
      <span dir="ltr" className="mono tabular-nums">{online.length}</span><span>متصل الآن</span>
      {showList && online.length > 0 && <span className="hidden font-semibold text-[#8a8a8a] md:inline">— {online.map((o) => o.name).slice(0, 6).join("، ")}{online.length > 6 ? " …" : ""}</span>}
    </div>
  );
}
