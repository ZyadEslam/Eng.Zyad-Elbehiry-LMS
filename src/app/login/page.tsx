"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, User } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SessionIcon } from "@/components/ui/icons";

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
      <label className="block"><span className="eyebrow">Username</span><div className="relative mt-1"><User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" /><input className="input pl-10" dir="ltr" value={username} onChange={(e) => setU(e.target.value)} autoComplete="username" required /></div></label>
      <label className="block"><span className="eyebrow">Password</span><div className="relative mt-1"><Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" /><input className="input pl-10" dir="ltr" type="password" value={password} onChange={(e) => setP(e.target.value)} autoComplete="current-password" required /></div></label>
      {err && <div className="rounded-xl border border-brand/30 bg-[#fdecec] px-4 py-2 text-sm font-extrabold text-brand">{err}</div>}
      <button type="submit" className="btn-primary w-full py-3 text-[17px]" disabled={busy}>{busy ? "…" : <>دخول <ArrowLeft size={18} /></>}</button>
      <p className="text-center text-[12px] font-bold text-[#8a8a8a]">الحسابات تُنشأ بواسطة المدرّس فقط</p>
    </form>
  );
}
export default function LoginPage() {
  return (
    <main className="paper relative min-h-screen overflow-hidden">
      <div className="topbar" />
      <div className="mx-auto grid min-h-[calc(100vh-5px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="space-y-7">
          <div data-reveal className="eyebrow">Programming &amp; Artificial Intelligence · Grade 11 · Term 1</div>
          <h1 data-reveal className="text-[44px] font-black leading-[1.15] md:text-[60px]">البرمجة<br />والذكاء <span className="text-brand">الاصطناعي</span></h1>
          <p data-reveal className="max-w-lg text-[17px] font-semibold leading-relaxed text-[#444]">١٤ جلسة تفاعلية تغطي الكتاب المدرسي كاملًا — شرح، أمثلة مصرية، أسئلة امتحانات، وتتبّع لتقدّمك في كل شريحة.</p>
          <div data-reveal className="flex flex-wrap gap-2">{[1, 2, 5, 6, 8, 10, 12, 13].map((n) => <span key={n} className="grid h-11 w-11 place-items-center rounded-xl border border-[#dcdcdc] bg-white text-[#333]"><SessionIcon num={n} className="h-5 w-5" /></span>)}</div>
          <div data-reveal className="flex items-center gap-4 border-t border-[#111] pt-5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#111] text-white"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7 3 12l5 5" /><path d="m16 7 5 5-5 5" /><path d="M14 4 10 20" /></svg></div>
            <div><div className="text-[17px] font-black">Eng. Zyad Elbehiry</div><div className="eyebrow">Engineering &amp; CS Track</div></div>
          </div>
        </Reveal>
        <Reveal className="flex justify-center lg:justify-end">
          <div className="panel w-full max-w-md p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)]" data-reveal>
            <div className="mb-6"><div className="eyebrow">Sign in</div><h2 className="mt-1 text-[28px] font-black leading-none">تسجيل الدخول</h2></div>
            <Suspense fallback={null}><LoginForm /></Suspense>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
