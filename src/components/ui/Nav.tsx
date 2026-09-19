"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Presence from "./Presence";
import type { SessionUser } from "@/lib/auth";
export default function Nav({ user }: { user: SessionUser }) {
  const path = usePathname(); const router = useRouter();
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); };
  const L = ({ href, label }: { href: string; label: string }) => <Link href={href} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-extrabold transition ${path === href || (href !== "/admin" && path.startsWith(href)) ? "bg-brand text-white shadow-[0_6px_14px_rgba(230,41,45,.3)]" : "text-gray-700 hover:bg-brand-light hover:text-brand"}`}>{label}</Link>;
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-[1.5px] border-[#e6e6e6]">
      <div className="topbar" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5 sm:px-4">
        <Logo />
        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto">
          <L href="/dashboard" label="الجلسات" />
          {user.role === "ADMIN" && <><L href="/admin" label="لوحة التحكم" /><L href="/admin/users" label="المستخدمون" /></>}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex rounded-full border-[1.5px] border-[#e6e6e6] bg-white px-3 py-1"><Presence /></div>
          <div className="hidden sm:block text-right text-sm leading-tight"><div className="font-black">{user.name}</div><div className="text-[11px] font-bold text-[#5f6368]" dir="ltr">@{user.username} · {user.role === "ADMIN" ? "Admin" : "Student"}</div></div>
          <button onClick={logout} className="btn-dark py-1.5 text-sm">خروج</button>
        </div>
      </div>
    </header>
  );
}
