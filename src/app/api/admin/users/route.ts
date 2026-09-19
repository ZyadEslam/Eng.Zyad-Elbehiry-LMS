import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { handler } from "@/lib/api";
import { SESSIONS, ONLINE_WINDOW_MS } from "@/lib/content";

export const GET = handler(async () => {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" }, include: { progress: true, _count: { select: { quizResults: true } } } });
  const now = Date.now();
  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id, username: u.username, name: u.name, role: u.role, active: u.active, createdAt: u.createdAt, lastSeenAt: u.lastSeenAt,
      online: !!u.lastSeenAt && now - u.lastSeenAt.getTime() < ONLINE_WINDOW_MS,
      completed: u.progress.filter((p) => p.completed).length, totalSessions: SESSIONS.length,
      timeSpentSec: u.progress.reduce((a, p) => a + p.timeSpentSec, 0),
      progress: u.progress.map((p) => ({ sessionNum: p.sessionNum, maxSlide: p.maxSlide, totalSlides: p.totalSlides, completed: p.completed, timeSpentSec: p.timeSpentSec, updatedAt: p.updatedAt })),
    })),
  });
});

const Create = z.object({ username: z.string().min(3).max(32).regex(/^[a-z0-9._-]+$/i, "حروف إنجليزية وأرقام فقط"), name: z.string().min(2).max(64), password: z.string().min(6).max(128), role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT") });
export const POST = handler(async (req: Request) => {
  await requireAdmin();
  const p = Create.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message || "بيانات غير صالحة" }, { status: 400 });
  const username = p.data.username.toLowerCase();
  if (await prisma.user.findUnique({ where: { username } })) return NextResponse.json({ error: "اسم المستخدم موجود بالفعل" }, { status: 409 });
  const user = await prisma.user.create({ data: { username, name: p.data.name, role: p.data.role, passwordHash: await hashPassword(p.data.password) } });
  return NextResponse.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } }, { status: 201 });
});
