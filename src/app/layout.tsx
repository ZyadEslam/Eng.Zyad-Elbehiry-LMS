import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "منصة البرمجة والذكاء الاصطناعي — Eng. Zyad Elbehiry", description: "منصة تعليمية تفاعلية للصف الثاني الثانوي — مسار الهندسة وعلوم الحاسب" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ar" dir="rtl"><head><link rel="preload" href="/fonts/Cairo-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>);
}
