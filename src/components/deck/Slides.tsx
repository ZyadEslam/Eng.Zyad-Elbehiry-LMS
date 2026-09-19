/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { Session, Slide } from "@/lib/content";
import { CHAPTERS, COURSE, CREATOR } from "@/lib/content";

/** data-a = animation kind (l/r/z/d/""), data-d = delay in seconds — consumed by GSAP in Player */
const A = (kind = "", d?: number) => ({ "data-a": kind, ...(d !== undefined ? { "data-d": d } : {}) });

function Head({ num, title, en }: { num: React.ReactNode; title: string; en?: string }) {
  return (
    <div className="hd">
      <div className="num" {...A("z")}>{num}</div>
      <div {...A("l", 0.1)}><h2>{title}</h2>{en && <div className="en">{en}</div>}</div>
    </div>
  );
}
const Card = ({ it, a }: { it: any; a: any }) => (
  <div className="card" {...a}><span className="ic">{it.icon}</span><h3>{it.t}</h3><p>{it.d}</p>{it.code && <pre className="code">{it.code}</pre>}</div>
);
const Side = ({ items, kind = "l", d0 = 0.5, step = 0.3, gap = 14 }: { items: any[]; kind?: string; d0?: number; step?: number; gap?: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>{items.map((it, k) => <Card key={k} it={it} a={A(kind, d0 + k * step)} />)}</div>
);

export function TitleSlide({ s }: { s: Session }) {
  const ch = CHAPTERS[String(s.chapter)];
  return (
    <div className="title-slide">
      <div className="icon" style={{ top: 80, left: 120 }}>{s.icon}</div>
      <div className="icon" style={{ bottom: 100, right: 120, animationDirection: "reverse" }}>{ch.icon}</div>
      <div className="logo" {...A("z")}>{"</>"}</div>
      <div className="course" {...A("", 0.2)}>{COURSE}</div>
      <h1 {...A("", 0.35)}><span className="sess">الفصل {s.chapter}: {ch.name} — الجلسة {s.num}</span>{s.title}</h1>
      <div className="sub" {...A("", 0.5)}>{s.en}</div>
      <div className="by" {...A("d", 0.7)}>👨‍🏫 إعداد وتقديم: {CREATOR} <span>{ch.en}</span></div>
    </div>
  );
}
export function EndSlide({ s }: { s: Session }) {
  return (
    <div className="end" style={{ height: "100%" }}>
      <div style={{ width: 100, height: 100, borderRadius: 24, background: "var(--red)", display: "grid", placeItems: "center", color: "#fff", fontFamily: "Consolas,monospace", fontSize: 40, fontWeight: 900, marginBottom: 20 }} {...A("z")}>{"</>"}</div>
      <h1 {...A("", 0.2)}>شكرًا! 🎉</h1>
      <p {...A("", 0.4)}>خلّصنا الجلسة {s.num}: {s.title}</p>
      <p {...A("", 0.6)} style={{ fontWeight: 800, color: "#111", marginTop: 24 }}>👨‍🏫 {CREATOR}</p>
      <p {...A("", 0.8)} style={{ fontSize: 17 }}>{COURSE} • مسار الهندسة وعلوم الحاسب • الترم الأول</p>
      <p {...A("", 1.0)} style={{ fontSize: 16, marginTop: 20, background: "#111", color: "#fff", padding: "8px 20px", borderRadius: 999 }}>بنفهم التكنولوجيا… مش بس بنستخدمها 💡</p>
    </div>
  );
}

const Hook = ({ sl, s }: P) => (
  <div className="hook"><div className="big">{s.icon}</div>
    <div className="pill" {...A("z")}>{sl.title}</div>
    <div className="q" style={{ marginTop: 26 }} {...A("l", 0.3)}>{sl.q}</div>
    <div className="s" {...A("", 0.9)}>{sl.sub}</div></div>
);
const Objectives = ({ sl }: P) => (<>
  <Head num="🎯" title="أهداف الجلسة" en="Learning Objectives" />
  {sl.items.map((it: any, k: number) => (
    <div className="obj" key={k} {...A("l", 0.25 + k * 0.25)}><div className="n">{k + 1}</div><div className="ic">{it.icon}</div><div><h3>{it.t}</h3><p>{it.d}</p></div></div>
  ))}
</>);
const Timeline = ({ sl }: P) => (<>
  <Head num="⏱" title={sl.title} />
  <div className="tl">{sl.steps.map((it: any, k: number) => (
    <div className="it" key={k} {...A("l", 0.25 + k * 0.22)}><div className="y">{it.y}</div><div className="ic">{it.icon}</div><div><h3>{it.t}</h3><p>{it.d}</p></div></div>
  ))}</div>
</>);
const Chart = ({ sl }: P) => {
  const mx = Math.max(...sl.bars.map((b: any) => b[1]));
  return (<>
    <Head num="📈" title={sl.title} />
    <div className="lead" {...A("", 0.2)}>{sl.lead}</div>
    <div className="chartwrap">
      <div {...A("", 0.4)}><div className="bars"><span className="unit">{sl.unit}</span>
        {sl.bars.map(([y, v]: any, k: number) => (
          <div className="b" key={k}><div className="val">{v}x</div><div className="bar" style={{ ["--h" as any]: `${Math.round(v / mx * 100)}%` }} /><div className="lbl">{y}</div></div>
        ))}</div></div>
      <Side items={sl.side} kind="r" d0={0.6} />
    </div>
  </>);
};
const Cards = ({ sl }: P) => {
  const cols = sl.cols || 2;
  return (<>
    <Head num="💡" title={sl.title} />
    {sl.lead && <div className="lead" {...A("", 0.15)}>{sl.lead}</div>}
    <div className={`grid g${cols}`}>{sl.items.map((it: any, k: number) => <Card key={k} it={it} a={A("z", 0.25 + k * 0.2)} />)}</div>
    {sl.foot && <div className="foot-note" {...A("", 0.3 + sl.items.length * 0.2)}>💬 {sl.foot}</div>}
  </>);
};
const Examples = ({ sl }: P) => (<>
  <Head num="🇪🇬" title={sl.title} en="Real-World Examples" />
  <div className="grid g2">{sl.items.map((it: any, k: number) => <Card key={k} it={it} a={A(k % 2 ? "l" : "r", 0.25 + k * 0.2)} />)}</div>
</>);

/** Quiz: interactive – clicking an option reveals right/wrong + explanation; reports result via onQuiz */
function Quiz({ sl, onQuiz }: P) {
  const [done, setDone] = React.useState<Record<number, number>>({});
  return (<>
    <Head num="❓" title={sl.title} en="Interactive Quiz — دوس على الإجابة" />
    {sl.items.map((q: any, k: number) => {
      const picked = done[k];
      return (
        <div key={k} className={`qz${k ? " frag" : ""}${picked !== undefined ? " done" : ""}`} {...(k === 0 ? A("", 0.25) : {})}>
          <div className="q"><span className="n">{k + 1}</span><span>{q.q}</span></div>
          <div className="opts">{q.opts.map((o: string, j: number) => (
            <div key={j} className={`opt${picked !== undefined ? (j === q.ans ? " ok" : " no") : ""}`}
              onClick={(e) => { e.stopPropagation(); if (picked !== undefined) return; setDone({ ...done, [k]: j }); onQuiz?.(j === q.ans); }}>{o}</div>
          ))}</div>
          <div className="why">💡 {q.why}</div>
        </div>
      );
    })}
  </>);
}
const Challenge = ({ sl }: P) => (<>
  <Head num="🧠" title={sl.title} en="Think Like an Engineer" />
  <div className="ch">
    <div><div className="sc" {...A("r", 0.2)}><p>{sl.scenario}</p></div><div className="dl" {...A("", 1.4)}>📦 المطلوب تسليمه: {sl.deliverable}</div></div>
    <div>{sl.steps.map((st: any, k: number) => <div className="st" key={k} {...A("l", 0.5 + k * 0.3)}><div className="n">{k + 1}</div><div><h3>{st.t}</h3><p>{st.d}</p></div></div>)}</div>
  </div>
</>);
const Summary = ({ sl }: P) => (<>
  <Head num="📌" title="ملخص الجلسة" en="Session Summary" />
  <div className="sm">
    <div>{sl.points.map((p: string, k: number) => <div className="pt" key={k} {...A("l", 0.2 + k * 0.2)}><span className="ck">✔</span><span>{p}</span></div>)}</div>
    <div className="side">
      <div className="quote" {...A("z", 0.6)}>{sl.quote}</div>
      <div className="kws" {...A("", 0.9)}>{sl.keywords.map((k: string) => <span className="kw" key={k}>{k}</span>)}</div>
      <div className="next" {...A("", 1.1)}>⏭️ <b>الجاية:</b> {sl.next}</div>
    </div>
  </div>
</>);
const Nested = ({ sl }: P) => (<>
  <Head num="🎯" title={sl.title} en="AI ⊃ ML ⊃ DL ⊃ GenAI" />
  <div className="rings">
    <div className="ringbox">{sl.rings.map((r: any, k: number) => <div className="ring" key={k} {...A("z", 0.2 + k * 0.25)}>{r.t}</div>)}</div>
    <div className="ringtxt">{sl.rings.map((r: any, k: number) => <div className="it" key={k} {...A("l", 0.4 + k * 0.25)}><h3>{r.t}</h3><p>{r.d}</p></div>)}</div>
  </div>
</>);
const Network = ({ sl }: P) => {
  const L: [number, number[]][] = [[90, [150, 260, 370]], [300, [100, 205, 315, 420]], [510, [200, 320]]];
  const edges: React.ReactNode[] = []; let k = 0;
  for (let a = 0; a < 2; a++) for (const y1 of L[a][1]) for (const y2 of L[a + 1][1]) edges.push(<line key={k++} className="edge" x1={L[a][0]} y1={y1} x2={L[a + 1][0]} y2={y2} />);
  return (<>
    <Head num="🕸️" title={sl.title} en="Artificial Neural Network" />
    <div className="lead" {...A("", 0.15)}>{sl.lead}</div>
    <div className="net">
      <div className="netsvg" {...A("", 0.3)}><svg viewBox="0 0 600 490" width="100%" style={{ maxHeight: 430, display: "block", margin: "auto" }}>
        {edges}
        {L.map(([x, ys], i) => ys.map((y) => <circle key={`${x}-${y}`} className="node" cx={x} cy={y} r={20} style={{ animationDelay: `${(i * 0.3).toFixed(1)}s` }} />))}
        {sl.layers.map((l: string, i: number) => <text key={i} x={L[i][0]} y={470} textAnchor="middle">{l}</text>)}
      </svg></div>
      <Side items={sl.side} d0={0.5} step={0.25} gap={12} />
    </div>
  </>);
};
const Col = ({ c, side, k0 }: { c: any; side: string; k0: number }) => (
  <div className={`col ${c.tone || ""}`}><div className="h" {...A(side, k0 - 0.1)}>{c.h}</div>
    {c.items.map(([a, b]: any, k: number) => <div className="row" key={k} {...A(side, k0 + k * 0.15)}><b>{a}</b><span>{b}</span></div>)}</div>
);
const Compare = ({ sl }: P) => (<>
  <Head num="⚖️" title={sl.title} />
  <div className="cmp"><Col c={sl.left} side="r" k0={0.25} /><Col c={sl.right} side="l" k0={0.45} /></div>
  {sl.foot && <div className="foot-note" {...A("", 1.2)}>💬 {sl.foot}</div>}
</>);
const Flow = ({ sl }: P) => (<>
  <Head num="🔁" title={sl.title} />
  {sl.lead && <div className="lead" {...A("", 0.15)}>{sl.lead}</div>}
  <div className="flow">{sl.steps.map((st: any, k: number) => (
    <React.Fragment key={k}>{k > 0 && <div className="ar" {...A("", 0.35 + k * 0.3)}>←</div>}
      <div className="fs" {...A("z", 0.3 + k * 0.3)}><span className="ic">{st.icon}</span><h3>{st.t}</h3><p>{st.d}</p></div></React.Fragment>
  ))}</div>
</>);
const Layers = ({ sl }: P) => (<>
  <Head num="🧅" title={sl.title} en="Defense in Depth & Zero Trust" />
  <div className="lay">
    <div className="onion">{sl.rings.map((r: string, k: number) => <div key={k} style={{ inset: k * 42, background: `rgba(230,41,45,${0.04 + k * 0.05})` }} {...A("z", 0.2 + k * 0.2)}>{r}</div>)}</div>
    <Side items={sl.side} d0={0.8} />
  </div>
</>);
const Matrix = ({ sl }: P) => {
  const lv = ["منخفض", "متوسط", "عالي"];
  const colors = [["c1", "c1", "c2"], ["c1", "c2", "c3"], ["c2", "c3", "c4"]];
  const names = [["منخفض جدًا", "منخفض", "متوسط"], ["منخفض", "متوسط", "مرتفع"], ["متوسط", "مرتفع", "مرتفع جدًا"]];
  const cells: React.ReactNode[] = [<div className="hcell" key="h">التأثير ↓ / الاحتمالية →</div>, ...lv.map((l) => <div className="hcell" key={l}>{l}</div>)];
  for (let r = 0; r < 3; r++) { const rr = 2 - r; cells.push(<div className="hcell" key={`r${r}`}>{lv[rr]}</div>); for (let c = 0; c < 3; c++) cells.push(<div key={`${r}${c}`} className={`cell ${colors[rr][c]}`} style={{ transitionDelay: `${((r * 3 + c) * 0.08).toFixed(2)}s` }}>{names[rr][c]}</div>); }
  return (<>
    <Head num="🧮" title={sl.title} en="Risk Assessment Matrix" />
    <div className="lead" {...A("", 0.1)}>{sl.lead}</div>
    <div className="mx"><div {...A("", 0.3)}><div className="mgrid">{cells}</div></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" {...A("l", 0.3)}><span className="ic">🧮</span><h3>المعادلة</h3><p style={{ fontSize: 22, fontWeight: 900, color: "var(--red)" }}>المخاطرة = التأثير × الاحتمالية</p></div>
        <div className="card" {...A("l", 0.6)}><span className="ic">🔴</span><h3>مرتفع جدًا</h3><p>تأثير عالي + احتمال عالي ← عالجه فورًا بأعلى أولوية (مثال: هجوم فدية على سيرفر الدرجات).</p></div>
        <div className="card" {...A("l", 0.9)}><span className="ic">🟢</span><h3>منخفض جدًا</h3><p>تأثير منخفض + احتمال منخفض ← آخر القائمة (مثال: عطل في طابعة احتياطية).</p></div>
      </div></div>
  </>);
};
const Codes = ({ sl }: P) => (<>
  <Head num="🧾" title={sl.title} en="Status Codes • API • JSON" />
  <div className="cd">
    <div className="code-list">{sl.codes.map((c: any, k: number) => <div className="c" key={k} {...A("r", 0.2 + k * 0.15)}><div className={`num ${c.tone}`}>{c.c}</div><div><b>{c.t}</b><span>{c.d}</span></div></div>)}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sl.side.map((it: any, k: number) => <Card key={k} it={it} a={A("l", 0.5 + k * 0.3)} />)}
      <div {...A("", 1.1)}><pre className="code">{sl.json}</pre></div>
    </div>
  </div>
</>);
const Table = ({ sl }: P) => (<>
  <Head num="📊" title={sl.title} en={sl.en || "Comparison Table"} />
  <table className="tb"><thead><tr {...A("", 0.15)}>{sl.head.map((h: string, i: number) => <th key={i}>{h}</th>)}</tr></thead>
    <tbody>{sl.rows.map((r: string[], k: number) => <tr key={k} {...A("l", 0.3 + k * 0.18)}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table>
</>);
const Metrics = ({ sl }: P) => (<>
  <Head num="📈" title={sl.title} en="Web Analytics Metrics" />
  <div className="mt">{sl.items.map((it: any, k: number) => <div className="m" key={k} {...A("z", 0.25 + k * 0.25)}><div className="ic">{it.icon}</div><div className="v">{it.v}</div><h3>{it.t}</h3><p>{it.d}</p></div>)}</div>
</>);
const Cycle = ({ sl }: P) => (<>
  <Head num="🔄" title={sl.title} en="Plan → Do → Check → Act" />
  <div className="cyc">
    <div className="wheel">{sl.steps.map((st: any, k: number) => <div className="c" key={k} {...A("z", 0.2 + k * 0.25)}><span className="ic">{st.icon}</span>{st.t}</div>)}<div className="mid">PDCA</div></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{sl.steps.map((st: any, k: number) => <div className="card" key={k} {...A("l", 0.4 + k * 0.25)} style={{ padding: "12px 18px" }}><h3>{st.icon} {st.t}</h3><p>{st.d}</p></div>)}</div>
  </div>
</>);
const AB = ({ sl }: P) => {
  const V = ({ x, d }: { x: any; d: number }) => (
    <div className="v" {...A("z", d)}><div className="lb">{x.label}</div>
      <div className="mock"><div className="ln" style={{ width: "70%" }} /><div className="ln" style={{ width: "50%" }} /><div className="ln" style={{ width: "60%" }} /><span className="btn" style={{ background: x.color }}>{x.btn}</span></div>
      <div className="rate">{x.rate}</div><div style={{ color: "var(--muted)", fontWeight: 700 }}>لقوا الزرار</div></div>
  );
  return (<><Head num="🧪" title={sl.title} en="A/B Test" /><div className="lead" {...A("", 0.1)}>{sl.lead}</div><div className="ab"><V x={sl.a} d={0.3} /><V x={sl.b} d={0.55} /></div></>);
};
const Terms = ({ sl }: P) => (<>
  <Head num="📖" title={sl.title || "مصطلحات أساسية من الكتاب"} en={sl.en || "Key Terms — Glossary"} />
  <div className="terms">{sl.items.map((it: any, k: number) => <div className="term" key={k} {...A(k % 2 ? "l" : "r", 0.15 + k * 0.12)}><div className="k"><b>{it.t}</b><span>{it.en || ""}</span></div><p>{it.d}</p></div>)}</div>
</>);
const Tips = ({ sl }: P) => (<>
  <Head num="⚠️" title={sl.title || "خلّي بالك في الامتحان"} en={sl.en || "Exam Alerts — common traps"} />
  {sl.lead && <div className="lead" {...A("", 0.1)}>{sl.lead}</div>}
  <div className="tips">{sl.items.map((t: string, k: number) => <div className="tip" key={k} {...A("z", 0.2 + k * 0.15)}><span className="ic">{k % 2 ? "🚫" : "⚠️"}</span><div dangerouslySetInnerHTML={{ __html: t }} /></div>)}</div>
</>);
const QA = ({ sl }: P) => (<>
  <Head num="✍️" title={sl.title || "أسئلة الكتاب — أجب باختصار"} en={sl.en || "Short-answer drill — click to reveal"} />
  <div className="qa">{sl.items.map((it: any, k: number) => <div className="item" key={k} {...A("l", 0.15 + k * 0.12)}><div className="n">{k + 1}</div><div className="q">{it.q}</div><div className="a frag">{it.a}</div></div>)}</div>
</>);
const Fill = ({ sl }: P) => {
  const parts = String(sl.text).split(/\[(\d+)\]/);
  return (<>
    <Head num="🧩" title={sl.title || "أكمل الفراغات"} en={sl.en || "Fill in the blanks — from the textbook"} />
    <div className="fill">
      <div className="para" {...A("", 0.15)}>{parts.map((p, i) => i % 2 ? <span className="blank" key={i}>({p})</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</div>
      <div className="ans">{sl.answers.map((a: string, i: number) => <span className="frag" key={i}>({i + 1}) {a}</span>)}</div>
    </div>
  </>);
};
const Essay = ({ sl }: P) => (<>
  <Head num="📝" title={sl.title || "سؤال مقالي — زي الامتحان"} en={sl.en || "Essay question with model answer"} />
  <div className="essay">
    <div className="qbox" {...A("r", 0.15)}><span className="mark">{sl.marks || "6 درجات"}</span><p>{sl.q}</p><div className="hint">💡 {sl.hint || ""}</div></div>
    <div className="model" {...A("l", 0.35)}><h3>✅ إجابة نموذجية (دوس لإظهار النقاط)</h3>{sl.model.map((p: any, k: number) => <div className="pt frag" key={k}><span className="m">{p[0]}</span><span>{p[1]}</span></div>)}</div>
  </div>
</>);

type P = { sl: Slide; s: Session; onQuiz?: (correct: boolean) => void };
const RENDER: Record<string, React.ComponentType<P>> = { hook: Hook, objectives: Objectives, timeline: Timeline, chart: Chart, cards: Cards, examples: Examples, quiz: Quiz, challenge: Challenge, summary: Summary, nested: Nested, network: Network, compare: Compare, flow: Flow, layers: Layers, matrix: Matrix, codes: Codes, table: Table, metrics: Metrics, cycle: Cycle, ab: AB, terms: Terms, tips: Tips, qa: QA, fill: Fill, essay: Essay };

export function SlideBody({ sl, s, onQuiz }: P) {
  const C = RENDER[sl.type];
  if (!C) return <div className="lead">Unknown slide type: {sl.type}</div>;
  return <C sl={sl} s={s} onQuiz={onQuiz} />;
}
