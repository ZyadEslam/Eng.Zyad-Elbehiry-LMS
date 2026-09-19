"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Session } from "@/lib/content";
import { CHAPTERS, COURSE, CREATOR } from "@/lib/content";
import Circuit from "./Circuit";
import { SlideBody, TitleSlide, EndSlide } from "./Slides";
import "@/app/deck.css";

gsap.registerPlugin(useGSAP);

type Props = { session: Session; startSlide?: number; userName: string; isAdmin?: boolean };
const FROM: Record<string, gsap.TweenVars> = { l: { x: 40 }, r: { x: -40 }, z: { scale: 0.7 }, d: { y: -24 }, "": { y: 24 } };

export default function Player({ session: s, startSlide = 0, userName, isAdmin }: Props) {
  const ch = CHAPTERS[String(s.chapter)];
  const total = s.slides.length + 2;
  const notes = ["افتح بحماس: عرّف نفسك (" + CREATOR + ") وقول عنوان الجلسة والهدف منها في جملة واحدة.", ...s.slides.map((x) => x.notes || ""), "اشكر الطلبة وذكّرهم بالمهمة العملية وموعد الجلسة الجاية."];
  const [i, setI] = useState(() => {
    const h = typeof location !== "undefined" ? parseInt((location.hash || "").replace("#s", "")) : NaN;
    const n = Number.isFinite(h) && h > 0 ? h - 1 : startSlide;
    return Math.min(Math.max(n, 0), total - 1);
  });
  const [showNotes, setShowNotes] = useState(false);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const iRef = useRef(i); iRef.current = i;
  const { contextSafe } = useGSAP({ scope: root });

  /* ── scale 1280×720 deck to the viewport ── */
  useEffect(() => {
    const fit = () => { if (!deck.current) return; const vw = window.visualViewport?.width ?? innerWidth, vh = window.visualViewport?.height ?? innerHeight; const sc = Math.min(vw / 1280, vh / 720); deck.current.style.transform = `scale(${sc})`;
      root.current?.classList.toggle("portrait", vh > vw); };
    fit(); addEventListener("resize", fit); addEventListener("orientationchange", fit); window.visualViewport?.addEventListener("resize", fit);
    return () => { removeEventListener("resize", fit); removeEventListener("orientationchange", fit); window.visualViewport?.removeEventListener("resize", fit); };
  }, []);

  /* ── auto-fit: shrink dense slides so nothing passes the footer (port of fitAll) ── */
  const fitAll = useCallback(() => {
    if (!deck.current) return;
    const stage = deck.current.getBoundingClientRect(); const scale = stage.width / 1280; const limit = 674;
    deck.current.querySelectorAll<HTMLElement>(".slide").forEach((sl) => {
      const inner = sl.querySelector<HTMLElement>(".fitwrap"); if (!inner) return;
      const prev = { vis: sl.style.visibility, op: sl.style.opacity };
      sl.style.visibility = "visible"; sl.style.opacity = "1";
      const anim = [...inner.querySelectorAll<HTMLElement>("[data-a],.frag")];
      anim.forEach((e) => { e.style.opacity = "1"; e.style.visibility = "visible"; e.style.transform = "none"; });
      const bottom = () => (Math.max(0, ...[...inner.querySelectorAll<HTMLElement>("*")].filter((e) => e.offsetParent !== null).map((e) => e.getBoundingClientRect().bottom)) - stage.top) / scale;
      inner.style.zoom = "1"; let z = 1, b = bottom();
      for (let k = 0; k < 10 && b > limit; k++) { z -= 0.035; inner.style.zoom = String(z); b = bottom(); }
      anim.forEach((e) => { e.style.opacity = ""; e.style.visibility = ""; e.style.transform = ""; });
      sl.style.visibility = prev.vis; sl.style.opacity = prev.op;
    });
  }, []);
  useLayoutEffect(() => {
    fitAll(); setReady(true);
    document.fonts?.ready.then(() => fitAll());
  }, [fitAll]);

  /* ── GSAP entrance animation for the active slide ── */
  const animate = contextSafe((n: number) => {
    const all = deck.current?.querySelectorAll<HTMLElement>(".slide"); const sl = all?.[n]; if (!all || !sl) return;
    all.forEach((o, k) => { if (k !== n) { gsap.killTweensOf(o); gsap.set(o, { autoAlpha: 0 }); } });
    gsap.killTweensOf(sl.querySelectorAll("[data-a],.frag"));
    sl.querySelectorAll(".frag").forEach((f) => f.classList.remove("on"));
    gsap.set(sl.querySelectorAll(".frag"), { autoAlpha: 0, y: 20 });
    gsap.fromTo(sl, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" });
    sl.querySelectorAll<HTMLElement>("[data-a]").forEach((el, k) => {
      const kind = el.dataset.a || ""; const d = parseFloat(el.dataset.d ?? String(k * 0.12));
      el.classList.remove("in");
      gsap.fromTo(el, { autoAlpha: 0, x: 0, y: 0, scale: 1, ...FROM[kind] }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.08 + d, onStart: () => el.classList.add("in") });
    });
  });
  useEffect(() => { if (!ready) return; animate(i); history.replaceState(null, "", `#s${i + 1}`); }, [i, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── fragments (click-to-reveal answers, quiz items) ── */
  const nextFrag = contextSafe(() => {
    const sl = deck.current?.querySelectorAll<HTMLElement>(".slide")[iRef.current];
    const f = sl?.querySelector<HTMLElement>(".frag:not(.on)"); if (!f) return false;
    f.classList.add("on"); gsap.to(f, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }); return true;
  });
  const prevFrag = contextSafe(() => {
    const sl = deck.current?.querySelectorAll<HTMLElement>(".slide")[iRef.current];
    const fs = sl ? [...sl.querySelectorAll<HTMLElement>(".frag.on")] : []; if (!fs.length) return false;
    const f = fs[fs.length - 1]; f.classList.remove("on"); gsap.to(f, { autoAlpha: 0, y: 20, duration: 0.3 }); return true;
  });
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(total - 1, n))), [total]);
  const next = useCallback(() => { if (!nextFrag()) go(iRef.current + 1); }, [nextFrag, go]);
  const prev = useCallback(() => { if (!prevFrag()) go(iRef.current - 1); }, [prevFrag, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      else if (["ArrowRight", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === "Home") go(0); else if (e.key === "End") go(total - 1);
      else if (e.key.toLowerCase() === "n") setShowNotes((v) => !v);
      else if (e.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.();
      else if (e.key === "Escape") router.push("/dashboard");
    };
    let tx = 0; const ts = (e: TouchEvent) => (tx = e.touches[0].clientX);
    const te = (e: TouchEvent) => { const dx = e.changedTouches[0].clientX - tx; if (dx > 50) prev(); else if (dx < -50) next(); };
    addEventListener("keydown", onKey); addEventListener("touchstart", ts); addEventListener("touchend", te);
    return () => { removeEventListener("keydown", onKey); removeEventListener("touchstart", ts); removeEventListener("touchend", te); };
  }, [next, prev, go, total, router]);

  /* ── progress + time tracking + presence heartbeat ── */
  const lastTick = useRef(Date.now());
  const post = useCallback((slide: number, deltaSec: number) => {
    const body = JSON.stringify({ sessionNum: s.num, slide, deltaSec });
    if (document.visibilityState === "hidden" && navigator.sendBeacon) navigator.sendBeacon("/api/progress", new Blob([body], { type: "application/json" }));
    else fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }, [s.num]);
  useEffect(() => { if (!ready) return; const now = Date.now(); const d = Math.min(600, Math.round((now - lastTick.current) / 1000)); lastTick.current = now; post(i, d); }, [i, ready, post]);
  useEffect(() => {
    const beat = () => { if (document.visibilityState !== "visible") return; const now = Date.now(); const d = Math.min(600, Math.round((now - lastTick.current) / 1000)); lastTick.current = now; post(iRef.current, d); fetch("/api/presence/heartbeat", { method: "POST" }).catch(() => {}); };
    const id = setInterval(beat, 30_000);
    const vis = () => { if (document.visibilityState === "hidden") { const now = Date.now(); const d = Math.min(600, Math.round((now - lastTick.current) / 1000)); lastTick.current = now; post(iRef.current, d); } else lastTick.current = Date.now(); };
    document.addEventListener("visibilitychange", vis); addEventListener("pagehide", vis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", vis); removeEventListener("pagehide", vis); vis(); };
  }, [post]);
  const onQuiz = (slideIndex: number) => (correct: boolean) => fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionNum: s.num, slideIndex, correct }) }).catch(() => {});

  const bodies = [<TitleSlide key="t" s={s} />, ...s.slides.map((sl, k) => <SlideBody key={k} sl={sl} s={s} onQuiz={onQuiz(k + 1)} />), <EndSlide key="e" s={s} />];
  const prevHref = s.num > 1 ? `/session/${s.num - 1}` : "/dashboard", nextHref = s.num < 14 ? `/session/${s.num + 1}` : "/dashboard";

  return (
    <div className="player" ref={root}>
      <div id="help">← / Space: next • → : back • N: notes • F: fullscreen • Esc: exit</div>
      <div className="rotate-hint">🔄 لفّ الجهاز أفقيًا لعرض أفضل</div>
      <div id="stage">
        <div id="deck" ref={deck} onClick={(e) => { if ((e.target as HTMLElement).closest(".opt,.nav,button,a")) return; next(); }}>
          <Circuit />
          <div className="topbar" />
          <div className="brand"><div className="sq">{"</>"}</div><div>{CREATOR}<small>Programming &amp; AI — Grade 11</small></div></div>
          <div className="chap">{ch.icon} الفصل <b>{s.chapter}</b> • {ch.name} • الجلسة <b>{s.num}</b></div>
          {bodies.map((b, k) => <section key={k} className={`slide${k === i ? " active" : ""}`}><div className="fitwrap">{b}</div></section>)}
          <div id="prog" style={{ width: `${((i + 1) / total) * 100}%` }} />
          <div className="foot">
            <span className="tag">{COURSE} • الترم الأول</span>
            <span>
              <Link href={prevHref} style={{ color: "#ff8a8c", textDecoration: "none", marginLeft: 14 }}>◀ السابقة</Link>
              <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none", marginLeft: 14 }}>☰ الجلسات</Link>
              <Link href={nextHref} style={{ color: "#ff8a8c", textDecoration: "none" }}>التالية ▶</Link>
            </span>
            <span className="cnt" id="cnt">{userName} • {i + 1} / {total}</span>
          </div>
        </div>
      </div>
      <div className="nav"><button onClick={prev} title="السابق">→</button><button onClick={next} title="التالي">←</button></div>
      {isAdmin && <div id="notes" className={showNotes ? "show" : ""}>{notes[i]}</div>}
    </div>
  );
}
