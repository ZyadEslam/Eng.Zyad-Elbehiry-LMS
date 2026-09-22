import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSIONS, slideCount, ONLINE_WINDOW_MS } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";
import Ring from "@/components/ui/Ring";
import { SessionIcon } from "@/components/ui/icons";
export const dynamic = "force-dynamic";
const fmt = (sec: number) => sec < 60 ? `${sec}s` : sec < 3600 ? `${Math.round(sec / 60)}m` : `${(sec / 3600).toFixed(1)}h`;
const two = (n: number) => String(n).padStart(2, "0");
export default async function Student({ params }: { params: Promise<{ id: string }> }) {
  const me = await getSessionUser(); if (!me || me.role !== "ADMIN") redirect("/dashboard");
  const { id } = await params;
  const u = await prisma.user.findUnique({ where: { id }, include: { progress: true, quizResults: true } }); if (!u) notFound();
  const by = Object.fromEntries(u.progress.map((p) => [p.sessionNum, p]));
  const online = !!u.lastSeenAt && Date.now() - u.lastSeenAt.getTime() < ONLINE_WINDOW_MS;
  const qc = u.quizResults.filter((q) => q.correct).length, qt = u.quizResults.length;
  const overall = Math.round(SESSIONS.reduce((a, s) => { const r = by[s.num]; return a + (r ? Math.min(1, r.maxSlide / (slideCount(s) - 1)) : 0); }, 0) / SESSIONS.length * 100);
  return (<div className="flex min-h-screen flex-col">
    <Nav user={me} />
    <div className="paper paper-fade absolute inset-x-0 top-0 -z-10 h-[360px]" />
    <Reveal className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 pb-8 pt-10">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-extrabold text-[#666] hover:text-brand" data-reveal><ArrowRight size={15} /> كل المستخدمين</Link>
      <div className="panel flex flex-wrap items-center justify-between gap-6 p-6" data-reveal>
        <div className="flex items-center gap-5"><Ring pct={overall} size={96} stroke={8} sub="overall" /><div><div className="eyebrow">{u.role} · @{u.username}</div><h1 className="text-[28px] font-black leading-none">{u.name}</h1>{online && <span className="badge mt-2 bg-emerald-50 text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> متصل الآن</span>}</div></div>
        <div className="grid w-full grid-cols-3 gap-6 sm:w-auto">
          {[["Completed", `${u.progress.filter((p) => p.completed).length}/${SESSIONS.length}`], ["Study time", fmt(u.progress.reduce((a, p) => a + p.timeSpentSec, 0))], ["Quiz", qt ? `${Math.round(qc / qt * 100)}%` : "—"]].map(([l, v]) => <div key={l}><div className="eyebrow">{l}</div><div className="text-[24px] font-black leading-none" dir="ltr">{v}</div></div>)}
        </div>
      </div>
      <div className="panel divide-y divide-[#f0f0f0]" data-reveal>
        {SESSIONS.map((s) => { const p = by[s.num]; const total = slideCount(s); const pct = p ? Math.round(Math.min(1, p.maxSlide / (total - 1)) * 100) : 0; const sq = u.quizResults.filter((q) => q.sessionNum === s.num); return (
          <div key={s.num} className="grid grid-cols-[2.5rem_2.5rem_1fr_auto] items-center gap-4 px-5 py-3.5 text-sm">
            <span className="mono text-[20px] font-black text-[#ccc]">{two(s.num)}</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#e6e6e6] text-[#555]"><SessionIcon num={s.num} className="h-4 w-4" /></span>
            <div className="min-w-0"><div className="truncate font-extrabold">{s.title}</div><div className="mt-1.5 h-1 rounded-full bg-[#eee]"><div className={`h-1 rounded-full ${p?.completed ? "bg-emerald-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div></div>
            <div className="tick text-left leading-relaxed" dir="ltr"><div>{pct}% · slide {p ? p.lastSlide + 1 : 0}/{total}</div><div>{p ? fmt(p.timeSpentSec) : "—"}{sq.length ? ` · quiz ${sq.filter((q) => q.correct).length}/${sq.length}` : ""}</div></div>
          </div>); })}
      </div>
    </Reveal>
    <Footer />
  </div>);
}
