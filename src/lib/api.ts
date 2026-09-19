import { NextResponse } from "next/server";
/** Wrap a route handler so thrown Response objects (401/403) become proper responses. */
export function handler<T extends any[]>(fn: (...a: T) => Promise<Response>) {
  return async (...a: T) => {
    try { return await fn(...a); }
    catch (e) { if (e instanceof Response) return e; console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
  };
}
