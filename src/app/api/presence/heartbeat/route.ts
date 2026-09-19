import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handler } from "@/lib/api";
/** Client pings every 30s; a user is "online" if lastSeenAt is within ONLINE_WINDOW_MS. */
export const POST = handler(async () => {
  const u = await requireUser();
  await prisma.user.update({ where: { id: u.id }, data: { lastSeenAt: new Date() } });
  return NextResponse.json({ ok: true, at: Date.now() });
});
