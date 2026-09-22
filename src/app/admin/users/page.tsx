import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import UsersClient from "./UsersClient";
export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const user = await getSessionUser(); if (!user || user.role !== "ADMIN") redirect("/dashboard");
  return (<div className="flex min-h-screen flex-col"><Nav user={user} /><div className="paper paper-fade absolute inset-x-0 top-0 -z-10 h-[360px]" /><main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 pt-10"><UsersClient me={user.id} /></main><Footer /></div>);
}
