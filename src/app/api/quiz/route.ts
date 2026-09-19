import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handler } from "@/lib/api";
const Body = z.object({ sessionNum: z.number().int(), slideIndex: z.number().int(), correct: z.boolean() });
export const POST = handler(async (req: Request) => {
  const u = await requireUser();
  const p = Body.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "bad body" }, { status: 400 });
  await prisma.quizResult.create({ data: { userId: u.id, ...p.data } });
  return NextResponse.json({ ok: true });
});
