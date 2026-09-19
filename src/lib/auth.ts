import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const COOKIE = "lms_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-please-32chars!!");

export type SessionUser = { id: string; username: string; name: string; role: "ADMIN" | "STUDENT" };

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

export async function signToken(u: SessionUser) {
  return new SignJWT(u).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
}
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try { const { payload } = await jwtVerify(token, secret()); return payload as unknown as SessionUser; } catch { return null; }
}
/** Read the current user from the cookie (server components / route handlers). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const u = await verifyToken(c);
  if (!u) return null;
  // Make sure the account still exists & is active
  const db = await prisma.user.findUnique({ where: { id: u.id }, select: { id: true, username: true, name: true, role: true, active: true } });
  if (!db || !db.active) return null;
  return { id: db.id, username: db.username, name: db.name, role: db.role as SessionUser["role"] };
}
export async function requireUser() { const u = await getSessionUser(); if (!u) throw new Response("Unauthorized", { status: 401 }); return u; }
export async function requireAdmin() { const u = await requireUser(); if (u.role !== "ADMIN") throw new Response("Forbidden", { status: 403 }); return u; }
