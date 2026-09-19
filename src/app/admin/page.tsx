import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSIONS, ONLINE_WINDOW_MS } from "@/lib/content";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/ui/Reveal";
import Presence from "@/components/ui/Presence";

export const dynamic = "force-dynamic";
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

  return (<div className="deckbg min-h-screen flex flex-col">
    <Nav user={user} />
    <Reveal className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4" data-reveal>
        <div className="hd2"><div className="num">🛠</div><div><h2>لوحة التحكم</h2><div className="en">Admin Dashboard — live overview</div></div></div>
        <div className="flex gap-2"><Link href="/admin/users" className="btn-primary">+ إدارة المستخدمين</Link><Link href="/dashboard" className="btn-ghost">عرض المنصة كطالب</Link></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["👥", "طلاب نشطون", students], ["🟢", "متصلون الآن", online.length], ["✅", "جلسات مكتملة (إجمالي)", progress.filter((p) => p.completed).length], ["❓", "دقة الكويز", correct + wrong ? `${Math.round(correct / (correct + wrong) * 100)}%` : "—"]].map(([ic, l, v]) => (
          <div key={String(l)} className="panel p-5 text-center" data-reveal><div className="text-3xl">{ic}</div><div className="text-4xl font-black text-brand" dir="ltr">{v}</div><div className="text-sm font-extrabold text-[#5f6368]">{l}</div></div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="panel p-5 lg:col-span-2" data-reveal>
          <div className="hd2 mb-4"><div className="num text-base h-10 w-10">📊</div><div><h2 className="!text-lg">التقدم لكل جلسة</h2><div className="en">Progress per session</div></div></div>
          <div className="space-y-2">
            {perSession.map((s) => (
              <div key={s.num} className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_5rem_5rem] items-center gap-x-3 gap-y-1 text-sm">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white font-black shadow-[0_6px_14px_rgba(230,41,45,.3)]">{s.num}</span>
                <div><div className="font-bold truncate">{s.title}</div><div className="h-1.5 rounded-full bg-gray-100 mt-1"><div className="h-1.5 rounded-full bg-brand" style={{ width: `${s.avg}%` }} /></div></div>
                <span className="text-xs text-gray-500 font-bold">بدأ: {s.started}</span><span className="text-xs text-green-700 font-bold">أكمل: {s.completed}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-6">
          <section className="panel p-5" data-reveal>
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-black">🟢 المتصلون الآن</h2><Presence /></div>
            {online.length === 0 ? <p className="text-sm text-gray-400 font-semibold">لا يوجد متصلون</p> : (
              <ul className="space-y-2">{online.map((o) => <li key={o.id} className="flex items-center justify-between text-sm"><Link href={`/admin/students/${o.id}`} className="font-bold hover:text-brand">🟢 {o.name}</Link><span className="text-xs text-gray-500 font-bold">{o.progress[0] ? `جلسة ${o.progress[0].sessionNum} · شريحة ${o.progress[0].lastSlide + 1}` : "—"}</span></li>)}</ul>
            )}
          </section>
          <section className="panel p-5" data-reveal>
            <h2 className="text-lg font-black mb-3">⏱ آخر نشاط</h2>
            <ul className="space-y-2">{recent.map((r) => <li key={r.id} className="flex items-center justify-between text-sm"><Link href={`/admin/students/${r.user.id}`} className="font-bold hover:text-brand">{r.user.name}</Link><span className="text-xs text-gray-500 font-bold">جلسة {r.sessionNum} · {Math.round(r.maxSlide / Math.max(1, r.totalSlides - 1) * 100)}%</span></li>)}</ul>
          </section>
        </div>
      </div>
    </Reveal>
    <Footer />
  </div>);
}
