import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import UsersClient from "./UsersClient";
export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const user = await getSessionUser(); if (!user || user.role !== "ADMIN") redirect("/dashboard");
  return (<div className="deckbg min-h-screen flex flex-col"><Nav user={user} /><main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"><UsersClient me={user.id} /></main><Footer /></div>);
}
