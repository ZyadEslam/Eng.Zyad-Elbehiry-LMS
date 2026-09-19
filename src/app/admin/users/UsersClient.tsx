"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

type U = { id: string; username: string; name: string; role: string; active: boolean; online: boolean; lastSeenAt: string | null; completed: number; totalSessions: number; timeSpentSec: number };
const fmt = (sec: number) => sec < 60 ? `${sec} ث` : sec < 3600 ? `${Math.round(sec / 60)} د` : `${(sec / 3600).toFixed(1)} س`;
const rnd = () => Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6).toUpperCase() + "!";

export default function UsersClient({ me }: { me: string }) {
  const [users, setUsers] = useState<U[]>([]); const [q, setQ] = useState("");
  const [form, setForm] = useState({ username: "", name: "", password: rnd(), role: "STUDENT" }); const [msg, setMsg] = useState<{ ok?: string; err?: string }>({}); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const r = await fetch("/api/admin/users").then((r) => r.json()); setUsers(r.users || []); }, []);
  useEffect(() => { load(); const id = setInterval(load, 30_000); return () => clearInterval(id); }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg({});
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const j = await r.json(); setBusy(false);
    if (!r.ok) return setMsg({ err: j.error });
    setMsg({ ok: `تم إنشاء الحساب: ${form.username} / ${form.password} — انسخ كلمة المرور الآن` }); setForm({ username: "", name: "", password: rnd(), role: "STUDENT" }); load();
  };
  const patch = async (id: string, data: any, okMsg: string) => { const r = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const j = await r.json(); setMsg(r.ok ? { ok: okMsg } : { err: j.error }); load(); };
  const resetPw = (u: U) => { const p = rnd(); if (confirm(`إعادة تعيين كلمة مرور ${u.name} إلى: ${p} ؟`)) patch(u.id, { password: p }, `كلمة المرور الجديدة لـ ${u.username}: ${p}`); };
  const del = async (u: U) => { if (!confirm(`حذف ${u.name} نهائيًا مع كل بيانات تقدمه؟`)) return; const r = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" }); const j = await r.json(); setMsg(r.ok ? { ok: "تم الحذف" } : { err: j.error }); load(); };
  const list = users.filter((u) => (u.name + u.username).toLowerCase().includes(q.toLowerCase()));

  return (
    <Reveal className="space-y-6">
      <div className="hd2" data-reveal><div className="num">👥</div><div><h2>إدارة المستخدمين</h2><div className="en">Users — add students, reset passwords, track activity</div></div></div>
      <form onSubmit={create} className="panel p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end" data-reveal>
        <div className="sm:col-span-2 lg:col-span-5 font-black">➕ إضافة مستخدم جديد</div>
        <div><label className="text-xs font-bold">الاسم</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div><label className="text-xs font-bold">اسم المستخدم (إنجليزي)</label><input className="input" dir="ltr" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required pattern="[A-Za-z0-9._-]{3,32}" /></div>
        <div><label className="text-xs font-bold">كلمة المرور</label><input className="input" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
        <div><label className="text-xs font-bold">الدور</label><select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="STUDENT">طالب</option><option value="ADMIN">مدير</option></select></div>
        <button className="btn-primary py-2.5" disabled={busy}>إنشاء</button>
      </form>
      {msg.ok && <div className="rounded-xl bg-green-50 px-4 py-3 font-bold text-green-700 select-all" dir="auto">{msg.ok}</div>}
      {msg.err && <div className="rounded-xl bg-red-50 px-4 py-3 font-bold text-brand">{msg.err}</div>}

      <div className="panel overflow-hidden" data-reveal>
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4"><h2 className="font-black">كل المستخدمين ({users.length})</h2><input className="input max-w-xs" placeholder="بحث…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-[#111] text-xs text-white"><tr>{["الحالة", "الاسم", "المستخدم", "الدور", "الإنجاز", "الوقت", "آخر ظهور", "إجراءات"].map((h) => <th key={h} className="px-4 py-3 text-right font-extrabold">{h}</th>)}</tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u.id} className={`border-t border-gray-100 ${!u.active ? "opacity-50" : ""}`}>
              <td className="px-4 py-3">{u.online ? <span className="badge bg-green-100 text-green-700">● متصل</span> : <span className="badge bg-gray-100 text-gray-500">○ غير متصل</span>}</td>
              <td className="px-4 py-3 font-black"><Link href={`/admin/students/${u.id}`} className="hover:text-brand">{u.name}</Link>{!u.active && <span className="badge bg-red-100 text-brand mr-2">معطّل</span>}</td>
              <td className="px-4 py-3 font-mono" dir="ltr">{u.username}</td>
              <td className="px-4 py-3">{u.role === "ADMIN" ? <span className="badge bg-brand-light text-brand">مدير</span> : <span className="badge bg-blue-50 text-blue-700">طالب</span>}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-brand" style={{ width: `${u.completed / u.totalSessions * 100}%` }} /></div><span className="text-xs font-bold" dir="ltr">{u.completed}/{u.totalSessions}</span></div></td>
              <td className="px-4 py-3 font-bold">{fmt(u.timeSpentSec)}</td>
              <td className="px-4 py-3 text-xs text-gray-500 font-bold">{u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString("ar-EG") : "—"}</td>
              <td className="px-4 py-3"><div className="flex flex-wrap gap-1">
                <button className="btn-ghost px-2 py-1 text-xs" onClick={() => resetPw(u)}>🔑 كلمة مرور</button>
                {u.id !== me && <>
                  <button className="btn-ghost px-2 py-1 text-xs" onClick={() => patch(u.id, { active: !u.active }, u.active ? "تم التعطيل" : "تم التفعيل")}>{u.active ? "⏸ تعطيل" : "▶ تفعيل"}</button>
                  <button className="btn-ghost px-2 py-1 text-xs" onClick={() => patch(u.id, { role: u.role === "ADMIN" ? "STUDENT" : "ADMIN" }, "تم تغيير الدور")}>{u.role === "ADMIN" ? "⬇ طالب" : "⬆ مدير"}</button>
                  <button className="btn-ghost px-2 py-1 text-xs text-brand" onClick={() => del(u)}>🗑</button>
                </>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </Reveal>
  );
}
