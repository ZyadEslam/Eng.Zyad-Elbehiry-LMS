import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handler } from "@/lib/api";
import { getSession, slideCount } from "@/lib/content";

export const GET = handler(async () => {
  const u = await requireUser();
  const rows = await prisma.progress.findMany({ where: { userId: u.id } });
  return NextResponse.json({ progress: rows });
});

const Body = z.object({ sessionNum: z.number().int().min(1).max(14), slide: z.number().int().min(0), deltaSec: z.number().int().min(0).max(600).default(0) });
/** Called by the player whenever the slide changes and every heartbeat (with time delta). */
export const POST = handler(async (req: Request) => {
  const u = await requireUser();
  const p = Body.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "bad body" }, { status: 400 });
  const s = getSession(p.data.sessionNum);
  if (!s) return NextResponse.json({ error: "no session" }, { status: 404 });
  const total = slideCount(s);
  const slide = Math.min(p.data.slide, total - 1);
  const existing = await prisma.progress.findUnique({ where: { userId_sessionNum: { userId: u.id, sessionNum: s.num } } });
  const maxSlide = Math.max(existing?.maxSlide ?? 0, slide);
  const row = await prisma.progress.upsert({
    where: { userId_sessionNum: { userId: u.id, sessionNum: s.num } },
    update: { lastSlide: slide, maxSlide, totalSlides: total, completed: (existing?.completed ?? false) || maxSlide >= total - 1, timeSpentSec: { increment: p.data.deltaSec } },
    create: { userId: u.id, sessionNum: s.num, lastSlide: slide, maxSlide, totalSlides: total, completed: maxSlide >= total - 1, timeSpentSec: p.data.deltaSec },
  });
  await prisma.user.update({ where: { id: u.id }, data: { lastSeenAt: new Date() } });
  return NextResponse.json({ progress: row });
});
