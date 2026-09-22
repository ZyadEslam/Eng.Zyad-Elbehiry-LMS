import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { COOKIE, signToken, verifyToken, type SessionUser } from "./auth-edge";
export { COOKIE, signToken, verifyToken, type SessionUser };

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

/** Read the current user from the cookie (server components / route handlers). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const u = await verifyToken(c);
  if (!u) return null;
  // Make sure the account still exists & is active (on a transient DB error, fall back to the signed token claims)
  try {
    const db = await prisma.user.findUnique({ where: { id: u.id }, select: { id: true, username: true, name: true, role: true, active: true } });
    if (!db || !db.active) return null;
    return { id: db.id, username: db.username, name: db.name, role: db.role as SessionUser["role"] };
  } catch (e) { console.error("[auth] db check failed:", e); return u; }
}
export async function requireUser() { const u = await getSessionUser(); if (!u) throw new Response("Unauthorized", { status: 401 }); return u; }
export async function requireAdmin() { const u = await requireUser(); if (u.role !== "ADMIN") throw new Response("Forbidden", { status: 403 }); return u; }
