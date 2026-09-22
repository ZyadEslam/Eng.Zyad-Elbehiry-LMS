// Edge-safe auth helpers (NO prisma / bcrypt imports) — used by middleware.ts
import { SignJWT, jwtVerify } from "jose";
export const COOKIE = "lms_session";
export type SessionUser = { id: string; username: string; name: string; role: "ADMIN" | "STUDENT" };
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-please-32chars!!");
export async function signToken(u: SessionUser) {
  return new SignJWT(u).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
}
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try { const { payload } = await jwtVerify(token, secret()); return payload as unknown as SessionUser; } catch { return null; }
}
