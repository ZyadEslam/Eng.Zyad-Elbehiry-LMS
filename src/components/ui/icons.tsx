import { History, BrainCircuit, Factory, Scale, KeyRound, ShieldCheck, Siren, Layers3, Radio, Code2, Clapperboard, LayoutDashboard, BarChart3, RefreshCw, Globe2, Shield, MonitorSmartphone, Palette, type LucideIcon } from "lucide-react";
/** Session number → icon (replaces emoji) */
export const SESSION_ICON: Record<number, LucideIcon> = { 1: History, 2: BrainCircuit, 3: Factory, 4: Scale, 5: KeyRound, 6: ShieldCheck, 7: Siren, 8: Layers3, 9: Radio, 10: Code2, 11: Clapperboard, 12: LayoutDashboard, 13: BarChart3, 14: RefreshCw };
export const CHAPTER_ICON: Record<string, LucideIcon> = { "1": Globe2, "2": Shield, "3": MonitorSmartphone, "4": Palette };
export function SessionIcon({ num, className, strokeWidth = 1.75 }: { num: number; className?: string; strokeWidth?: number }) { const I = SESSION_ICON[num] ?? Code2; return <I className={className} strokeWidth={strokeWidth} />; }
export function ChapterIcon({ ch, className, strokeWidth = 1.75 }: { ch: string | number; className?: string; strokeWidth?: number }) { const I = CHAPTER_ICON[String(ch)] ?? Globe2; return <I className={className} strokeWidth={strokeWidth} />; }
