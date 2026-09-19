import raw from "@/data/content.json";
export type Chapter = { name: string; en: string; icon: string };
export type Slide = { type: string; notes?: string; [k: string]: any };
export type Session = { num: number; chapter: number; title: string; en: string; icon: string; slides: Slide[] };
export const CREATOR = "Eng. Zyad Elbehiry";
export const COURSE = "البرمجة والذكاء الاصطناعي — الصف الثاني الثانوي";
export const CHAPTERS = raw.chapters as unknown as Record<string, Chapter>;
export const SESSIONS = (raw.sessions as unknown as Session[]).sort((a, b) => a.num - b.num);
export const getSession = (num: number) => SESSIONS.find((s) => s.num === num);
/** total slides including title + end slides */
export const slideCount = (s: Session) => s.slides.length + 2;
export const ONLINE_WINDOW_MS = 90_000;
