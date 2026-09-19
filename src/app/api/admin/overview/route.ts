import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler } from "@/lib/api";
import { SESSIONS, ONLINE_WINDOW_MS } from "@/lib/content";
export const GET = handler(async () => {
  await requireAdmin();
  const since = new Date(Date.now() - ONLINE_WINDOW_MS);
  const [students, online, progress, quiz] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", active: true } }),
    prisma.user.count({ where: { lastSeenAt: { gte: since }, active: true } }),
    prisma.progress.findMany(),
    prisma.quizResult.groupBy({ by: ["correct"], _count: true }),
  ]);
  const perSession = SESSIONS.map((s) => {
    const rows = progress.filter((p) => p.sessionNum === s.num);
    return { num: s.num, title: s.title, started: rows.length, completed: rows.filter((r) => r.completed).length, avgPct: rows.length ? Math.round(rows.reduce((a, r) => a + (r.totalSlides ? r.maxSlide / (r.totalSlides - 1) : 0), 0) / rows.length * 100) : 0 };
  });
  const correct = quiz.find((q) => q.correct)?._count ?? 0, wrong = quiz.find((q) => !q.correct)?._count ?? 0;
  return NextResponse.json({ students, online, perSession, quiz: { correct, wrong } });
});
