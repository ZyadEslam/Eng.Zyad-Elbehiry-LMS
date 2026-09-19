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
    <div className="flex items-center gap-2 text-sm font-bold">
      <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" /></span>
      <span>{online.length} متصل الآن</span>
      {showList && online.length > 0 && <span className="text-gray-500 font-semibold hidden md:inline">— {online.map((o) => o.name).slice(0, 6).join("، ")}{online.length > 6 ? " …" : ""}</span>}
    </div>
  );
}
