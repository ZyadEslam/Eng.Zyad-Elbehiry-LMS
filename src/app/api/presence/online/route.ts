import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handler } from "@/lib/api";
import { ONLINE_WINDOW_MS } from "@/lib/content";
export const GET = handler(async () => {
  await requireUser();
  const since = new Date(Date.now() - ONLINE_WINDOW_MS);
  const users = await prisma.user.findMany({ where: { lastSeenAt: { gte: since }, active: true }, select: { id: true, name: true, username: true, role: true, lastSeenAt: true }, orderBy: { lastSeenAt: "desc" } });
  return NextResponse.json({ online: users, count: users.length });
});
