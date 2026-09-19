"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
/** Staggers-in every direct child marked with [data-reveal] on mount. */
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo("[data-reveal]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out", clearProps: "transform" }); }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
