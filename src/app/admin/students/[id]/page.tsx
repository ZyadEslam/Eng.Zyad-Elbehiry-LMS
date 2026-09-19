import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSIONS, slideCount, ONLINE_WINDOW_MS } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";
export const dynamic = "force-dynamic";
const fmt = (sec: number) => sec < 60 ? `${sec} ث` : sec < 3600 ? `${Math.round(sec / 60)} د` : `${(sec / 3600).toFixed(1)} س`;
export default async function Student({ params }: { params: Promise<{ id: string }> }) {
  const me = await getSessionUser(); if (!me || me.role !== "ADMIN") redirect("/dashboard");
  const { id } = await params;
  const u = await prisma.user.findUnique({ where: { id }, include: { progress: true, quizResults: true } }); if (!u) notFound();
  const by = Object.fromEntries(u.progress.map((p) => [p.sessionNum, p]));
  const online = !!u.lastSeenAt && Date.now() - u.lastSeenAt.getTime() < ONLINE_WINDOW_MS;
  const qc = u.quizResults.filter((q) => q.correct).length, qt = u.quizResults.length;
  return (<div className="deckbg min-h-screen flex flex-col">
    <Nav user={me} />
    <Reveal className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 space-y-6">
      <Link href="/admin/users" className="text-sm font-bold text-gray-500 hover:text-brand" data-reveal>← كل المستخدمين</Link>
      <div className="panel p-6 flex flex-wrap items-center justify-between gap-4" data-reveal>
        <div><h1 className="text-2xl font-black">{u.name} {online && <span className="badge bg-green-100 text-green-700">● متصل الآن</span>}</h1><p className="text-gray-500 font-bold" dir="ltr">@{u.username}</p></div>
        <div className="grid w-full grid-cols-3 gap-4 text-center sm:w-auto">
          {[["جلسات مكتملة", `${u.progress.filter((p) => p.completed).length}/${SESSIONS.length}`], ["وقت المذاكرة", fmt(u.progress.reduce((a, p) => a + p.timeSpentSec, 0))], ["الكويز", qt ? `${qc}/${qt} (${Math.round(qc / qt * 100)}%)` : "—"]].map(([l, v]) => <div key={l}><div className="text-xs text-gray-500 font-bold">{l}</div><div className="text-xl font-black" dir="ltr">{v}</div></div>)}
        </div>
      </div>
      <div className="panel divide-y divide-gray-100" data-reveal>
        {SESSIONS.map((s) => { const p = by[s.num]; const total = slideCount(s); const pct = p ? Math.round(Math.min(1, p.maxSlide / (total - 1)) * 100) : 0; const sq = u.quizResults.filter((q) => q.sessionNum === s.num); return (
          <div key={s.num} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 p-4 text-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white font-black shadow-[0_6px_14px_rgba(230,41,45,.3)]">{s.num}</span>
            <div><div className="font-black">{s.icon} {s.title}</div><div className="mt-1 h-1.5 rounded-full bg-gray-100"><div className={`h-1.5 rounded-full ${p?.completed ? "bg-green-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div></div>
            <div className="text-left text-xs font-bold text-gray-500 space-y-0.5" dir="ltr"><div>{pct}% · slide {p ? p.lastSlide + 1 : 0}/{total}</div><div>{p ? fmt(p.timeSpentSec) : "—"}{sq.length ? ` · quiz ${sq.filter((q) => q.correct).length}/${sq.length}` : ""}</div><div>{p ? new Date(p.updatedAt).toLocaleString("ar-EG") : ""}</div></div>
          </div>); })}
      </div>
    </Reveal>
    <Footer />
  </div>);
}
