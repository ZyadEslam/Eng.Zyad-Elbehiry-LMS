"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Reveal from "@/components/ui/Reveal";

function LoginForm() {
  const router = useRouter(); const sp = useSearchParams();
  const [username, setU] = useState(""); const [password, setP] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error || "خطأ");
    router.push(sp.get("next") || (j.role === "ADMIN" ? "/admin" : "/dashboard")); router.refresh();
  };
  return (
    <form onSubmit={submit} className="space-y-4" suppressHydrationWarning>
      <div><label className="mb-1 block text-sm font-extrabold">اسم المستخدم</label><input className="input" dir="ltr" value={username} onChange={(e) => setU(e.target.value)} autoComplete="username" required /></div>
      <div><label className="mb-1 block text-sm font-extrabold">كلمة المرور</label><input className="input" dir="ltr" type="password" value={password} onChange={(e) => setP(e.target.value)} autoComplete="current-password" required /></div>
      {err && <div className="rounded-xl bg-[#fdecec] px-4 py-2 text-sm font-extrabold text-brand">{err}</div>}
      <button type="submit" className="btn-primary w-full py-3 text-lg" disabled={busy}>{busy ? "..." : "دخول"}</button>
      <p className="text-center text-xs font-bold text-[#5f6368]">الحسابات بيتم إنشاؤها من المدرّس فقط</p>
    </form>
  );
}
export default function LoginPage() {
  return (
    <main className="deckbg relative min-h-screen overflow-hidden">
      <div className="topbar" />
      <div className="mx-auto grid min-h-[calc(100vh-6px)] max-w-6xl items-center gap-8 px-4 py-8 md:gap-10 md:py-10 lg:grid-cols-2">
        <Reveal className="space-y-6 text-center lg:text-right">
          <div className="mx-auto inline-grid h-[110px] w-[110px] place-items-center rounded-[26px] bg-brand font-mono text-[46px] font-black text-white shadow-[0_20px_40px_rgba(230,41,45,.4)] animate-[float_3.5s_ease-in-out_infinite] lg:mx-0" data-reveal>{"</>"}</div>
          <div data-reveal className="text-xl font-bold text-[#5f6368]">البرمجة والذكاء الاصطناعي — الصف الثاني الثانوي</div>
          <h1 data-reveal className="text-3xl font-black leading-snug md:text-4xl lg:text-5xl"><span className="block text-2xl font-extrabold text-brand mb-2">منصة تعليمية تفاعلية</span>14 جلسة • 249 شريحة متحركة<br />جاهزة للامتحان</h1>
          <p data-reveal className="text-lg font-semibold text-[#333]">مسار الهندسة وعلوم الحاسب • الترم الأول</p>
          <div data-reveal className="inline-flex items-center gap-3 rounded-full bg-[#111] px-6 py-3 text-lg font-extrabold text-white">👨‍🏫 إعداد وتقديم: Eng. Zyad Elbehiry <span className="text-sm font-semibold text-[#ff8a8c]">Programming &amp; AI</span></div>
        </Reveal>
        <Reveal className="flex justify-center">
          <div className="panel w-full max-w-md p-8" data-reveal>
            <div className="hd2 mb-6"><div className="num">🔐</div><div><h2>تسجيل الدخول</h2><div className="en">Sign in to your account</div></div></div>
            <Suspense fallback={null}><LoginForm /></Suspense>
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </main>
  );
}
