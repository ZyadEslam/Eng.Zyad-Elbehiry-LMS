import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Radio, CheckCircle2, HelpCircle, UserPlus, Eye, ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSIONS, ONLINE_WINDOW_MS } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";
import Presence from "@/components/ui/Presence";
import { SessionIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
const two = (n: number) => String(n).padStart(2, "0");
export default async function Admin() {
  const user = await getSessionUser(); if (!user || user.role !== "ADMIN") redirect("/dashboard");
  const since = new Date(Date.now() - ONLINE_WINDOW_MS);
  const [students, online, progress, quiz, recent] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", active: true } }),
    prisma.user.findMany({ where: { lastSeenAt: { gte: since }, active: true }, select: { id: true, name: true, role: true, progress: { orderBy: { updatedAt: "desc" }, take: 1 } } }),
    prisma.progress.findMany(),
    prisma.quizResult.groupBy({ by: ["correct"], _count: true }),
    prisma.progress.findMany({ orderBy: { updatedAt: "desc" }, take: 8, include: { user: { select: { name: true, id: true } } } }),
  ]);
  const correct = quiz.find((q) => q.correct)?._count ?? 0, wrong = quiz.find((q) => !q.correct)?._count ?? 0;
  const perSession = SESSIONS.map((s) => { const rows = progress.filter((p) => p.sessionNum === s.num); return { ...s, started: rows.length, completed: rows.filter((r) => r.completed).length, avg: rows.length ? Math.round(rows.reduce((a, r) => a + (r.totalSlides > 1 ? r.maxSlide / (r.totalSlides - 1) : 0), 0) / rows.length * 100) : 0 }; });
  const stats = [[Users, "Active students", "طلاب نشطون", students], [Radio, "Online now", "متصلون الآن", online.length], [CheckCircle2, "Sessions completed", "جلسات مكتملة", progress.filter((p) => p.completed).length], [HelpCircle, "Quiz accuracy", "دقة الكويز", correct + wrong ? `${Math.round(correct / (correct + wrong) * 100)}%` : "—"]] as const;

  return (<div className="flex min-h-screen flex-col">
    <Nav user={user} />
    <div className="paper paper-fade absolute inset-x-0 top-0 -z-10 h-[360px]" />
    <Reveal className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 pb-8 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
        <div><div className="eyebrow">Admin · live overview</div><h1 className="mt-1 text-[36px] font-black leading-none">لوحة التحكم</h1></div>
        <div className="flex gap-2"><Link href="/admin/users" className="btn-primary"><UserPlus size={17} /> إدارة المستخدمين</Link><Link href="/dashboard" className="btn-ghost"><Eye size={17} /> عرض كطالب</Link></div>
      </div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[#e6e6e6] bg-[#e6e6e6] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([Icon, en, ar, v]) => (
          <div key={en} className="bg-white p-5" data-reveal><div className="flex items-center justify-between"><span className="eyebrow">{en}</span><Icon size={18} className="text-[#bbb]" /></div><div className="mt-3 text-[40px] font-black leading-none" dir="ltr">{v}</div><div className="mt-1 text-[13px] font-bold text-[#666]">{ar}</div></div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="panel p-6 lg:col-span-2" data-reveal>
          <div className="hd2 mb-4"><div><h2 className="!text-[20px]">التقدم لكل جلسة</h2><div className="en">Started · completed · average progress</div></div></div>
          <div className="divide-y divide-[#f0f0f0]">
            {perSession.map((s) => (
              <div key={s.num} className="grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-1 py-2.5 text-sm sm:grid-cols-[2.5rem_1fr_5rem_5rem]">
                <span className="mono text-[20px] font-black text-[#ccc]">{two(s.num)}</span>
                <div className="min-w-0"><div className="flex items-center gap-2 truncate font-extrabold"><SessionIcon num={s.num} className="h-4 w-4 flex-none text-[#999]" />{s.title}</div><div className="mt-1 h-1 rounded-full bg-[#eee]"><div className="h-1 rounded-full bg-brand" style={{ width: `${s.avg}%` }} /></div></div>
                <span className="tick" dir="ltr">started {s.started}</span><span className="tick text-emerald-700" dir="ltr">done {s.completed}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-6">
          <section className="panel p-6" data-reveal>
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-black">المتصلون الآن</h2><Presence /></div>
            {online.length === 0 ? <p className="text-sm font-bold text-[#999]">لا يوجد متصلون حاليًا</p> : (
              <ul className="divide-y divide-[#f0f0f0]">{online.map((o) => <li key={o.id} className="flex items-center justify-between py-2 text-sm"><Link href={`/admin/students/${o.id}`} className="flex items-center gap-2 font-extrabold hover:text-brand"><span className="h-2 w-2 rounded-full bg-emerald-500" />{o.name}</Link><span className="tick" dir="ltr">{o.progress[0] ? `S${two(o.progress[0].sessionNum)} · slide ${o.progress[0].lastSlide + 1}` : "—"}</span></li>)}</ul>
            )}
          </section>
          <section className="panel p-6" data-reveal>
            <h2 className="mb-3 text-[17px] font-black">آخر نشاط</h2>
            <ul className="divide-y divide-[#f0f0f0]">{recent.map((r) => <li key={r.id} className="flex items-center justify-between py-2 text-sm"><Link href={`/admin/students/${r.user.id}`} className="flex items-center gap-1 font-extrabold hover:text-brand">{r.user.name}<ArrowLeft size={13} className="text-[#ccc]" /></Link><span className="tick" dir="ltr">S{two(r.sessionNum)} · {Math.round(r.maxSlide / Math.max(1, r.totalSlides - 1) * 100)}%</span></li>)}</ul>
          </section>
        </div>
      </div>
    </Reveal>
    <Footer />
  </div>);
}
