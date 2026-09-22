"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, Pause, Play, ShieldCheck, GraduationCap, Trash2, Search, UserPlus, Copy } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

type U = { id: string; username: string; name: string; role: string; active: boolean; online: boolean; lastSeenAt: string | null; completed: number; totalSessions: number; timeSpentSec: number };
const fmt = (sec: number) => sec < 60 ? `${sec}s` : sec < 3600 ? `${Math.round(sec / 60)}m` : `${(sec / 3600).toFixed(1)}h`;
const rnd = () => Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6).toUpperCase() + "!";
const IconBtn = ({ onClick, title, children, danger }: any) => <button onClick={onClick} title={title} className={`grid h-8 w-8 place-items-center rounded-lg border border-[#e6e6e6] text-[#555] transition hover:border-[#111] hover:text-[#111] ${danger ? "hover:!border-brand hover:!text-brand" : ""}`}>{children}</button>;

export default function UsersClient({ me }: { me: string }) {
  const [users, setUsers] = useState<U[]>([]); const [q, setQ] = useState("");
  const [form, setForm] = useState({ username: "", name: "", password: rnd(), role: "STUDENT" }); const [msg, setMsg] = useState<{ ok?: string; err?: string }>({}); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const r = await fetch("/api/admin/users").then((r) => r.json()); setUsers(r.users || []); }, []);
  useEffect(() => { load(); const id = setInterval(load, 30_000); return () => clearInterval(id); }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg({});
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const j = await r.json(); setBusy(false);
    if (!r.ok) return setMsg({ err: j.error });
    setMsg({ ok: `${form.username} / ${form.password}` }); setForm({ username: "", name: "", password: rnd(), role: "STUDENT" }); load();
  };
  const patch = async (id: string, data: any, okMsg: string) => { const r = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const j = await r.json(); setMsg(r.ok ? { ok: okMsg } : { err: j.error }); load(); };
  const resetPw = (u: U) => { const p = rnd(); if (confirm(`إعادة تعيين كلمة مرور ${u.name} إلى: ${p} ؟`)) patch(u.id, { password: p }, `${u.username} / ${p}`); };
  const del = async (u: U) => { if (!confirm(`حذف ${u.name} نهائيًا مع كل بيانات تقدمه؟`)) return; const r = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" }); const j = await r.json(); setMsg(r.ok ? { ok: "تم الحذف" } : { err: j.error }); load(); };
  const list = users.filter((u) => (u.name + u.username).toLowerCase().includes(q.toLowerCase()));

  return (
    <Reveal className="space-y-8">
      <div data-reveal><div className="eyebrow">Admin · users</div><h1 className="mt-1 text-[36px] font-black leading-none">إدارة المستخدمين</h1></div>

      <form onSubmit={create} className="panel p-6" data-reveal>
        <div className="mb-4 flex items-center gap-2 text-[17px] font-black"><UserPlus size={18} className="text-brand" /> إضافة حساب جديد</div>
        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block"><span className="eyebrow">Name</span><input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="block"><span className="eyebrow">Username</span><input className="input mt-1" dir="ltr" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required pattern="[A-Za-z0-9._-]{3,32}" /></label>
          <label className="block"><span className="eyebrow">Password</span><input className="input mono mt-1" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></label>
          <label className="block"><span className="eyebrow">Role</span><select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="STUDENT">طالب</option><option value="ADMIN">مدير</option></select></label>
          <button className="btn-dark py-2.5" disabled={busy}>إنشاء</button>
        </div>
      </form>
      {msg.ok && <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-extrabold text-emerald-800"><span>✓ تم — بيانات الدخول: <code className="mono select-all rounded bg-white px-2 py-0.5 text-[13px]" dir="ltr">{msg.ok}</code></span><button className="btn-ghost px-3 py-1 text-xs" onClick={() => navigator.clipboard?.writeText(msg.ok!)}><Copy size={13} /> نسخ</button></div>}
      {msg.err && <div className="rounded-xl border border-brand/30 bg-[#fdecec] px-4 py-3 font-extrabold text-brand">{msg.err}</div>}

      <div className="panel overflow-hidden" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e6e6] p-4"><h2 className="text-[17px] font-black">كل المستخدمين <span className="mono text-[#999]">({users.length})</span></h2><div className="relative w-full max-w-xs"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" /><input className="input pl-9 py-2 text-sm" placeholder="بحث…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-[#e6e6e6]">{["", "الاسم", "Username", "الدور", "الإنجاز", "الوقت", "آخر ظهور", ""].map((h, i) => <th key={i} className="eyebrow px-4 py-3 text-right">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#f0f0f0]">{list.map((u) => (
            <tr key={u.id} className={!u.active ? "opacity-40" : ""}>
              <td className="px-4 py-3"><span className={`block h-2.5 w-2.5 rounded-full ${u.online ? "bg-emerald-500" : "bg-[#ddd]"}`} title={u.online ? "متصل" : "غير متصل"} /></td>
              <td className="px-4 py-3 font-black"><Link href={`/admin/students/${u.id}`} className="hover:text-brand">{u.name}</Link>{!u.active && <span className="badge mr-2 bg-[#fdecec] text-brand">معطّل</span>}</td>
              <td className="mono px-4 py-3 text-[13px]" dir="ltr">{u.username}</td>
              <td className="px-4 py-3">{u.role === "ADMIN" ? <span className="badge bg-[#111] text-white">ADMIN</span> : <span className="badge border border-[#e6e6e6] text-[#555]">STUDENT</span>}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-1 w-20 rounded-full bg-[#eee]"><div className="h-1 rounded-full bg-brand" style={{ width: `${u.completed / u.totalSessions * 100}%` }} /></div><span className="tick" dir="ltr">{u.completed}/{u.totalSessions}</span></div></td>
              <td className="tick px-4 py-3" dir="ltr">{fmt(u.timeSpentSec)}</td>
              <td className="tick px-4 py-3">{u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" }) : "—"}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-1">
                <IconBtn title="إعادة تعيين كلمة المرور" onClick={() => resetPw(u)}><KeyRound size={14} /></IconBtn>
                {u.id !== me && <>
                  <IconBtn title={u.active ? "تعطيل" : "تفعيل"} onClick={() => patch(u.id, { active: !u.active }, u.active ? "تم التعطيل" : "تم التفعيل")}>{u.active ? <Pause size={14} /> : <Play size={14} />}</IconBtn>
                  <IconBtn title={u.role === "ADMIN" ? "تحويل إلى طالب" : "ترقية إلى مدير"} onClick={() => patch(u.id, { role: u.role === "ADMIN" ? "STUDENT" : "ADMIN" }, "تم تغيير الدور")}>{u.role === "ADMIN" ? <GraduationCap size={14} /> : <ShieldCheck size={14} />}</IconBtn>
                  <IconBtn title="حذف" danger onClick={() => del(u)}><Trash2 size={14} /></IconBtn>
                </>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </Reveal>
  );
}
