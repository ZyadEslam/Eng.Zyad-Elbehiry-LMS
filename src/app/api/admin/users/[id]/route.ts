import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { handler } from "@/lib/api";

const Patch = z.object({ name: z.string().min(2).max(64).optional(), password: z.string().min(6).max(128).optional(), role: z.enum(["ADMIN", "STUDENT"]).optional(), active: z.boolean().optional() });
type Ctx = { params: Promise<{ id: string }> };

export const PATCH = handler(async (req: Request, ctx: Ctx) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const p = Patch.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  if (id === admin.id && (p.data.active === false || p.data.role === "STUDENT")) return NextResponse.json({ error: "لا يمكنك تعطيل حسابك أو تخفيض صلاحياتك" }, { status: 400 });
  const data: any = { ...p.data }; delete data.password;
  if (p.data.password) data.passwordHash = await hashPassword(p.data.password);
  const user = await prisma.user.update({ where: { id }, data, select: { id: true, username: true, name: true, role: true, active: true } });
  return NextResponse.json({ user });
});

export const DELETE = handler(async (_req: Request, ctx: Ctx) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  if (id === admin.id) return NextResponse.json({ error: "لا يمكنك حذف حسابك" }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
