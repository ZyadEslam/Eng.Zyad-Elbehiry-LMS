import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHAPTERS, SESSIONS, slideCount } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";
const fmt = (sec: number) => sec < 60 ? `${sec} ث` : sec < 3600 ? `${Math.round(sec / 60)} د` : `${(sec / 3600).toFixed(1)} س`;

export default async function Dashboard() {
  const user = await getSessionUser(); if (!user) redirect("/login");
  const rows = await prisma.progress.findMany({ where: { userId: user.id } });
  const byNum = Object.fromEntries(rows.map((r) => [r.sessionNum, r]));
  const done = rows.filter((r) => r.completed).length;
  const totalTime = rows.reduce((a, r) => a + r.timeSpentSec, 0);
  const overall = Math.round(SESSIONS.reduce((a, s) => { const r = byNum[s.num]; return a + (r ? Math.min(1, r.maxSlide / (slideCount(s) - 1)) : 0); }, 0) / SESSIONS.length * 100);
  const resume = SESSIONS.find((s) => !byNum[s.num]?.completed) ?? SESSIONS[0];

  return (<div className="deckbg min-h-screen flex flex-col">
    <Nav user={user} />
    <Reveal className="mx-auto w-full max-w-6xl px-4 py-8 space-y-10 flex-1">
      {/* hero – mirrors the deck title slide */}
      <section className="panel relative overflow-hidden p-6 md:p-8" data-reveal>
        <div className="pointer-events-none absolute -left-10 -bottom-16 text-[160px] opacity-10 select-none">{resume.icon}</div>
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="hidden sm:grid h-[84px] w-[84px] flex-none place-items-center rounded-[22px] bg-brand font-mono text-[34px] font-black text-white shadow-[0_16px_34px_rgba(230,41,45,.4)]">{"</>"}</div>
            <div>
              <div className="font-bold text-[#5f6368]">أهلًا يا {user.name} 👋</div>
              <h1 className="text-2xl font-black leading-tight md:text-3xl">البرمجة والذكاء الاصطناعي <span className="text-brand">— الترم الأول</span></h1>
              <div className="text-sm font-semibold text-[#5f6368]" dir="ltr">Programming &amp; AI — Grade 11 • Engineering &amp; CS Track</div>
            </div>
          </div>
          <Link href={`/session/${resume.num}`} className="btn-primary w-full px-7 py-3 text-lg sm:w-auto">▶ {byNum[resume.num] ? "كمّل" : "ابدأ"} الجلسة {resume.num}</Link>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[["📈", "الإنجاز الكلي", `${overall}%`], ["✅", "جلسات مكتملة", `${done} / ${SESSIONS.length}`], ["⏱", "وقت المذاكرة", fmt(totalTime)], ["🗂", "الشرائح", `${SESSIONS.reduce((a, s) => a + slideCount(s), 0)}`]].map(([ic, l, v]) => (
            <div key={l} className="rounded-2xl border-[1.5px] border-[#e6e6e6] bg-white p-4 text-center"><div className="text-2xl">{ic}</div><div className="text-3xl font-black text-brand" dir="ltr">{v}</div><div className="text-xs font-extrabold text-[#5f6368]">{l}</div></div>
          ))}
        </div>
        <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-[#eee]"><div className="h-2 rounded-full bg-gradient-to-l from-brand to-[#ff6b6e] transition-all" style={{ width: `${overall}%` }} /></div>
      </section>

      {Object.entries(CHAPTERS).map(([cn, ch]) => (
        <section key={cn} className="space-y-4">
          <div className="hd2" data-reveal><div className="num">{cn}</div><div><h2>{ch.icon} {ch.name}</h2><div className="en">{ch.en}</div></div></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SESSIONS.filter((s) => String(s.chapter) === cn).map((s) => {
              const r = byNum[s.num]; const total = slideCount(s); const pct = r ? Math.round(Math.min(1, r.maxSlide / (total - 1)) * 100) : 0;
              return (
                <Link key={s.num} href={`/session/${s.num}`} className="panel group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,.08)]" data-reveal>
                  <span className="absolute inset-y-0 right-0 w-1.5 bg-brand opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-start justify-between">
                    <span className="inline-block rounded-[14px] border-[1.5px] border-[#ffd7d8] bg-[#fff5f5] px-3.5 py-2 text-[34px] leading-none">{s.icon}</span>
                    {r?.completed ? <span className="badge bg-[#e7f7ee] text-[#0b5f36]">✔ مكتملة</span> : r ? <span className="badge bg-[#fff8e1] text-[#8a5a00]">جارية {pct}%</span> : <span className="badge bg-[#f3f3f3] text-[#5f6368]">لم تبدأ</span>}
                  </div>
                  <div className="mt-3 inline-block rounded-full bg-brand px-3 py-0.5 text-xs font-extrabold text-white">الجلسة {s.num}</div>
                  <h3 className="mt-1 text-[19px] font-black leading-snug group-hover:text-brand">{s.title}</h3>
                  <p className="text-xs font-semibold text-[#5f6368]" dir="ltr">{s.en}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-extrabold text-[#5f6368]"><span>{total} شريحة</span><span dir="ltr">{r ? `${fmt(r.timeSpentSec)} · ` : ""}{pct}%</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eee]"><div className={`h-1.5 rounded-full ${r?.completed ? "bg-[#1a9c5b]" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </Reveal>
    <Footer />
  </div>);
}
