import { PrismaClient } from "@prisma/client";

/** Normalise the connection string for serverless (Vercel) + pooled Postgres (Supabase PgBouncer / Neon).
 *  - Supabase pooler on :6543 needs ?pgbouncer=true  (otherwise: "prepared statement s0 already exists")
 *  - keep each lambda to 1 connection so the pool is not exhausted on cold-start bursts */
function dbUrl() {
  const raw = process.env.DATABASE_URL || "";
  if (!raw.startsWith("postgres")) return raw;
  try {
    const u = new URL(raw);
    const pooled = u.hostname.includes("pooler.supabase.com") || u.port === "6543" || u.hostname.includes("-pooler.");
    if (pooled && u.hostname.includes("supabase") && !u.searchParams.has("pgbouncer")) u.searchParams.set("pgbouncer", "true");
    if (!u.searchParams.has("connection_limit")) u.searchParams.set("connection_limit", pooled ? "1" : "3");
    if (!u.searchParams.has("pool_timeout")) u.searchParams.set("pool_timeout", "20");
    if (!u.searchParams.has("connect_timeout")) u.searchParams.set("connect_timeout", "15");
    return u.toString();
  } catch { return raw; }
}

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  g.prisma ??
  new PrismaClient({
    datasources: { db: { url: dbUrl() } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
// Reuse the client across invocations (dev HMR and warm lambdas)
g.prisma = prisma;
