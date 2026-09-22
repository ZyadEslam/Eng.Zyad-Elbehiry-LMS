"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutGrid, Gauge, Users } from "lucide-react";
import Logo from "./Logo";
import Presence from "./Presence";
import type { SessionUser } from "@/lib/auth";
export default function Nav({ user }: { user: SessionUser }) {
  const path = usePathname(); const router = useRouter();
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); };
  const L = ({ href, label, Icon, exact }: { href: string; label: string; Icon: any; exact?: boolean }) => {
    const on = exact ? path === href : path.startsWith(href);
    return <Link href={href} className={`relative flex items-center gap-2 whitespace-nowrap px-3 py-3 text-[14px] font-extrabold transition ${on ? "text-brand" : "text-[#444] hover:text-[#111]"}`}><Icon size={17} strokeWidth={2.2} />{label}{on && <span className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-brand" />}</Link>;
  };
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6e6e6] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-4">
        <Link href="/dashboard" className="py-3"><Logo /></Link>
        <nav className="order-3 -mb-px flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto">
          <L href="/dashboard" label="الجلسات" Icon={LayoutGrid} />
          {user.role === "ADMIN" && <><L href="/admin" label="لوحة التحكم" Icon={Gauge} exact /><L href="/admin/users" label="المستخدمون" Icon={Users} /></>}
        </nav>
        <div className="flex items-center gap-4 py-2">
          <div className="hidden md:block"><Presence /></div>
          <div className="hidden h-6 w-px bg-[#e6e6e6] sm:block" />
          <div className="hidden text-right leading-tight sm:block"><div className="text-[13px] font-black">{user.name}</div><div className="mono text-[10.5px] font-bold uppercase tracking-widest text-[#8a8a8a]" dir="ltr">{user.role}</div></div>
          <button onClick={logout} title="خروج" className="grid h-9 w-9 place-items-center rounded-full border border-[#e6e6e6] text-[#444] transition hover:border-brand hover:text-brand"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  );
}
