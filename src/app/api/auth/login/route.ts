import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, COOKIE } from "@/lib/auth";
const Body = z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(128) });
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const { username, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { username: username.trim().toLowerCase() } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash)))
    return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
  const token = await signToken({ id: user.id, username: user.username, name: user.name, role: user.role as "ADMIN" | "STUDENT" });
  await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 24 * 3600 });
  return res;
}
