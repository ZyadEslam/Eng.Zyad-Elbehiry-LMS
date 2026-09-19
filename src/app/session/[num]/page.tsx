import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSession, SESSIONS } from "@/lib/content";
import Player from "@/components/deck/Player";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return SESSIONS.map((s) => ({ num: String(s.num) })); }

export default async function SessionPage({ params, searchParams }: { params: Promise<{ num: string }>; searchParams: Promise<{ from?: string }> }) {
  const user = await getSessionUser(); if (!user) redirect("/login");
  const { num } = await params; const { from } = await searchParams;
  const s = getSession(Number(num)); if (!s) notFound();
  const p = await prisma.progress.findUnique({ where: { userId_sessionNum: { userId: user.id, sessionNum: s.num } } });
  const start = from === "start" ? 0 : p && !p.completed ? p.lastSlide : 0;
  return <Player session={s} startSlide={start} userName={user.name} isAdmin={user.role === "ADMIN"} />;
}
