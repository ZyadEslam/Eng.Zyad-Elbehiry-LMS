import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHAPTERS, SESSIONS, slideCount } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";
import Ring from "@/components/ui/Ring";
import { SessionIcon, ChapterIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
const fmt = (sec: number) => sec < 60 ? `${sec}s` : sec < 3600 ? `${Math.round(sec / 60)}m` : `${(sec / 3600).toFixed(1)}h`;
const two = (n: number) => String(n).padStart(2, "0");

export default async function Dashboard() {
  const user = await getSessionUser(); if (!user) redirect("/login");
  const rows = await prisma.progress.findMany({ where: { userId: user.id } });
  const byNum = Object.fromEntries(rows.map((r) => [r.sessionNum, r]));
  const done = rows.filter((r) => r.completed).length;
  const totalTime = rows.reduce((a, r) => a + r.timeSpentSec, 0);
  const overall = Math.round(SESSIONS.reduce((a, s) => { const r = byNum[s.num]; return a + (r ? Math.min(1, r.maxSlide / (slideCount(s) - 1)) : 0); }, 0) / SESSIONS.length * 100);
  const resume = SESSIONS.find((s) => !byNum[s.num]?.completed) ?? SESSIONS[0];
  const rr = byNum[resume.num];

  return (<div className="flex min-h-screen flex-col">
    <Nav user={user} />
    <div className="paper paper-fade absolute inset-x-0 top-0 -z-10 h-[420px]" />
    <Reveal className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 pt-10 space-y-14">
      {/* hero */}
      <section className="grid items-center gap-8 lg:grid-cols-[1fr_auto]" data-reveal>
        <div>
          <div className="eyebrow">Welcome back</div>
          <h1 className="mt-1 text-[36px] font-black leading-[1.15] md:text-[44px]">أهلًا {user.name.replace(/^(Eng\.?|م\.|أ\.|د\.)\s*/i, "").split(" ")[0]}، <span className="text-brand">كمّل</span> من حيث وقفت</h1>
          <div className="mt-6 ticket panel flex flex-wrap items-center gap-5 p-5">
            <div className="grid h-14 w-14 flex-none place-items-center rounded-xl bg-[#111] text-white"><SessionIcon num={resume.num} className="h-7 w-7" /></div>
            <div className="min-w-0 flex-1">
              <div className="eyebrow">Session {two(resume.num)} · {CHAPTERS[String(resume.chapter)].en}</div>
              <div className="truncate text-[20px] font-black">{resume.title}</div>
              <div className="tick mt-1" dir="ltr">{rr ? `slide ${rr.lastSlide + 1} / ${slideCount(resume)} · ${fmt(rr.timeSpentSec)}` : `${slideCount(resume)} slides · not started`}</div>
            </div>
            <Link href={`/session/${resume.num}`} className="btn-primary w-full sm:w-auto"><PlayCircle size={18} /> {rr ? "كمّل الجلسة" : "ابدأ الجلسة"}</Link>
          </div>
        </div>
        <div className="panel flex items-center gap-6 p-6">
          <Ring pct={overall} size={124} sub="overall" />
          <div className="space-y-3">
            <div><div className="eyebrow">Completed</div><div className="text-[26px] font-black leading-none" dir="ltr">{done}<span className="text-[#bbb]"> / {SESSIONS.length}</span></div></div>
            <div><div className="eyebrow">Study time</div><div className="text-[26px] font-black leading-none" dir="ltr">{fmt(totalTime)}</div></div>
          </div>
        </div>
      </section>

      {Object.entries(CHAPTERS).map(([cn, ch]) => (
        <section key={cn} className="space-y-5">
          <div className="hd2" data-reveal>
            <div className="flex items-end gap-4"><span className="num">{two(Number(cn))}</span><div><h2>{ch.name}</h2><div className="en">{ch.en}</div></div></div>
            <ChapterIcon ch={cn} className="mb-1 h-8 w-8 text-[#bbb]" strokeWidth={1.5} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SESSIONS.filter((s) => String(s.chapter) === cn).map((s) => {
              const r = byNum[s.num]; const total = slideCount(s); const pct = r ? Math.round(Math.min(1, r.maxSlide / (total - 1)) * 100) : 0;
              return (
                <Link key={s.num} href={`/session/${s.num}`} className="group panel relative flex flex-col overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-[#111] hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,.35)]" data-reveal>
                  <div className="flex items-start justify-between">
                    <span className="mono text-[40px] font-black leading-none text-[#e3e3e3] transition group-hover:text-brand">{two(s.num)}</span>
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#e6e6e6] bg-[#fafafa] text-[#333] transition group-hover:border-brand group-hover:bg-brand group-hover:text-white"><SessionIcon num={s.num} className="h-5 w-5" /></span>
                  </div>
                  <h3 className="mt-4 text-[18px] font-black leading-snug">{s.title}</h3>
                  <p className="eyebrow mt-1 normal-case tracking-normal">{s.en}</p>
                  <div className="mt-auto pt-5">
                    <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-extrabold">
                      {r?.completed ? <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={13} /> مكتملة</span> : r ? <span className="flex items-center gap-1 text-[#8a5a00]"><Clock3 size={13} /> جارية</span> : <span className="text-[#8a8a8a]">لم تبدأ</span>}
                      <span className="tick" dir="ltr">{total} slides{r ? ` · ${fmt(r.timeSpentSec)}` : ""} · {pct}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-[#eee]"><div className={`h-1 ${r?.completed ? "bg-emerald-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
                  </div>
                  <ArrowLeft size={16} className="absolute bottom-5 left-5 text-[#ccc] opacity-0 transition group-hover:-translate-x-1 group-hover:text-brand group-hover:opacity-100" />
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
