import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
export default async function Home() { const u = await getSessionUser(); redirect(u ? (u.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"); }
