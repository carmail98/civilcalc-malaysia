"use client";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const stats = [
  { label: "Calculators", value: 19, suffix: "+" },
  { label: "Standards", value: 8, suffix: "" },
  { label: "Free to Start", value: 100, suffix: "%" },
];

const disciplines = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    title: "Hydrology",
    subtitle: "MSMA / JPS HP",
    detail: "Rational Method peak flow, IDF curves, time of concentration, detention pond volume, drain sizing per MSMA 2nd Edition and JPS HP1/HP5.",
    color: "sky",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: "Roads",
    subtitle: "JKR Specs",
    detail: "Flexible pavement design, road width checks, geometric design per JKR Standard Specifications Sections 6, 18, 20.",
    color: "amber",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    title: "Structures",
    subtitle: "MS EN Eurocode",
    detail: "RC beam moment & shear, column N-M interaction, pad footing, crack width checks per MS EN 1992, 1990, 1991, 1997.",
    color: "sage",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-2.55a1.5 1.5 0 01-.83-1.34V7.94a1.5 1.5 0 01.83-1.34l5.1-2.55a1.5 1.5 0 011.16 0l5.1 2.55a1.5 1.5 0 01.83 1.34v3.34a1.5 1.5 0 01-.83 1.34l-5.1 2.55a1.5 1.5 0 01-1.16 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-6.42" />
      </svg>
    ),
    title: "Sewerage",
    subtitle: "SPAN / MSIG",
    detail: "Sewer pipe sizing, minimum velocity (0.6 m/s), gradient and cover checks per SPAN technical guidelines and MSIG.",
    color: "rose",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Earthworks",
    subtitle: "JKR / General",
    detail: "Cut & fill volume estimation, slope gradient checks, and dry density compaction verification for site earthworks.",
    color: "ochre",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  sky:   { bg: "bg-sky-50/60",     border: "border-sky-200/60",     text: "text-sky-700",     iconBg: "bg-sky-100/80" },
  amber: { bg: "bg-amber-50/60",   border: "border-amber-200/60",   text: "text-amber-700",   iconBg: "bg-amber-100/80" },
  sage:  { bg: "bg-emerald-50/60", border: "border-emerald-200/60", text: "text-emerald-700", iconBg: "bg-emerald-100/80" },
  rose:  { bg: "bg-rose-50/60",    border: "border-rose-200/60",    text: "text-rose-700",    iconBg: "bg-rose-100/80" },
  ochre: { bg: "bg-yellow-50/60",  border: "border-yellow-200/60",  text: "text-yellow-700",  iconBg: "bg-yellow-100/80" },
};

const freeFeatures = [
  {
    title: "Stormwater hydrology",
    desc: "Rational Method peak flow, IDF curves, basic pipe sizing per JPS HP1.",
    formula: "Q = \\dfrac{CIA}{360}",
  },
  {
    title: "Sewer & water pipe design",
    desc: "Minimum velocity (0.6 m/s), gradient, and cover checks per SPAN guidelines.",
    formula: null,
  },
  {
    title: "Road earthworks",
    desc: "Pavement thickness and geometric checks to JKR specs.",
    formula: null,
  },
  {
    title: "RC structural checks",
    desc: "Beam, slab, and column design per MS EN 1992.",
    formula: null,
  },
  {
    title: "No installation needed",
    desc: "Runs instantly in any modern browser, desktop or mobile.",
    formula: null,
  },
  {
    title: "Quick project history",
    desc: "Save and revisit recent calculations for quick checks.",
    formula: null,
  },
];

const roles = [
  {
    id: "engineer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-2.55M11.42 15.17l5.1-2.55m-5.1 2.55V21m5.1-8.38l5.1-2.55M16.52 12.34V6.3a1.5 1.5 0 00-.83-1.34l-5.1-2.55a1.5 1.5 0 00-1.16 0l-5.1 2.55a1.5 1.5 0 00-.83 1.34v6.04" />
      </svg>
    ),
    label: "Practising Engineer",
    pitch: "Use CivilCalc for quick verification checks before submitting to PBT, JPS, JKR, or SPAN. Run preliminary sizing on-site or in the office — then hand off to full analysis software.",
  },
  {
    id: "student",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
    label: "Student / Graduate",
    pitch: "Learn Malaysian design methods hands-on. See how MSMA, JKR, and Eurocode formulas work with real inputs — perfect for assignments, FYP, and early career learning.",
  },
  {
    id: "contractor",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    label: "Contractor",
    pitch: "Get rapid on-site sizing during construction. Check drain dimensions, pavement thickness, and pipe gradients without waiting for the consultant's reply.",
  },
];

const roadmapSteps = [
  { label: "Core Calculators", status: "done" as const },
  { label: "Free Access", status: "done" as const },
  { label: "Community Q&A", status: "done" as const },
  { label: "PDF Reports", status: "current" as const },
  { label: "Team Tools", status: "upcoming" as const },
  { label: "Extended Modules", status: "upcoming" as const },
];

const freeVsProFeatures = [
  { feature: "Core calculators (drainage, roads, sewerage, RC)", free: true, pro: true },
  { feature: "Instant browser use — no installation", free: true, pro: true },
  { feature: "Limited project history", free: true, pro: true },
  { feature: "Cloud storage for projects & templates", free: false, pro: true },
  { feature: "PDF / Excel report exports", free: false, pro: true },
  { feature: "Custom IDF & catchment modelling", free: false, pro: true },
  { feature: "Extended modules (OSD, culvert, steel)", free: false, pro: true },
  { feature: "Team collaboration & role-based access", free: false, pro: true },
];

const authorities = [
  { abbr: "PBT", desc: "Local Planning Authority" },
  { abbr: "JPS", desc: "Dept. of Irrigation & Drainage" },
  { abbr: "JKR", desc: "Public Works Department" },
  { abbr: "SPAN", desc: "National Water Services Commission" },
  { abbr: "DOE", desc: "Dept. of Environment" },
  { abbr: "Bomba", desc: "Fire & Rescue Dept." },
  { abbr: "PLANMalaysia", desc: "Federal Town & Country Planning" },
];

/* ═══════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════ */

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   PAGE — Cozy Style
   ═══════════════════════════════════════════════ */

export default function AboutPage() {
  const [activeRole, setActiveRole] = useState("engineer");
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [hoveredAuthority, setHoveredAuthority] = useState<string | null>(null);

  return (
    <article className="space-y-20 text-center pb-12">

      {/* ════════ HERO ════════ */}
      <FadeIn>
        <header className="py-16 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-transparent -mx-4 px-6 rounded-b-3xl">
          <p className="text-sm font-medium tracking-wide text-amber-600/80 uppercase mb-3">
            Welcome to
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
            CivilCalc<span className="text-amber-600">.my</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Standards-compliant civil engineering calculators — built for Malaysia.
          </p>
          <p className="mt-3 text-stone-500 max-w-lg mx-auto text-sm leading-relaxed">
            Do quick, standards-compliant design checks for drainage, roads,
            sewerage, and structures in your browser.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/calculators"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-700 hover:shadow-lg transition-all"
            >
              Browse Calculators
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white/80 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-stone-700 shadow-sm hover:bg-white hover:shadow transition-all"
            >
              Sign In
            </a>
          </div>

          {/* Animated stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-sm px-7 py-5 min-w-[140px]"
              >
                <div className="text-2xl font-bold text-amber-600">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-stone-500 mt-1.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </header>
      </FadeIn>

      {/* ════════ ICON FEATURE CARDS (What Is) ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            What CivilCalc.my Is
          </h2>
          <p className="text-stone-500 text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
            An online platform covering the five core disciplines of Malaysian
            civil engineering — tap a card to learn more.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-4xl mx-auto">
            {disciplines.map((d, i) => {
              const c = colorMap[d.color];
              const isFlipped = flippedCard === i;
              return (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  onClick={() => setFlippedCard(isFlipped ? null : i)}
                  className={`relative cursor-pointer rounded-2xl border ${c.border} ${c.bg} p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 min-h-[170px] flex flex-col items-center justify-center`}
                >
                  {!isFlipped ? (
                    <>
                      <div className={`${c.iconBg} ${c.text} rounded-xl p-3 mb-3`}>
                        {d.icon}
                      </div>
                      <h3 className={`font-semibold ${c.text}`}>{d.title}</h3>
                      <p className="text-xs text-stone-500 mt-1">{d.subtitle}</p>
                      <p className="text-[10px] text-stone-400 mt-2.5">Tap to expand</p>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-left"
                    >
                      <h3 className={`font-semibold ${c.text} text-sm mb-1.5`}>{d.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{d.detail}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* ════════ FREE ACCESS — HOVER CHECKLIST ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Free Access
          </h2>
          <p className="text-sm text-stone-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need for quick preliminary checks — at no cost, no
            sign-up required.
          </p>

          <div className="max-w-xl mx-auto space-y-2.5">
            {freeFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative text-left rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm px-5 py-3.5 hover:border-amber-300 hover:shadow-sm transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-stone-700">{f.title}</span>
                </div>

                {/* Expandable detail */}
                <motion.div
                  initial={false}
                  animate={{
                    height: hoveredFeature === i ? "auto" : 0,
                    opacity: hoveredFeature === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-stone-500 mt-2 ml-9 leading-relaxed">{f.desc}</p>
                  {f.formula && (
                    <div className="mt-2 ml-9 inline-block bg-amber-50/60 rounded-lg px-3 py-1.5">
                      <InlineMath math={f.formula} />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ════════ FREE vs PRO TOGGLE ════════ */}
      <FadeIn>
        <section className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-stone-800 mb-5">
            Free vs Pro
          </h2>

          {/* Toggle */}
          <div className="inline-flex rounded-2xl border border-stone-200 p-1 bg-stone-100/80 mb-7">
            <button
              type="button"
              onClick={() => setPlan("free")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                plan === "free"
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setPlan("pro")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                plan === "pro"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Pro <span className="text-[10px] opacity-70">coming soon</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {freeVsProFeatures.map((row, i) => {
              const included = plan === "free" ? row.free : row.pro;
              return (
                <motion.div
                  key={i}
                  layout
                  className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-left text-sm transition-all ${
                    included
                      ? "bg-white/80 border border-stone-200"
                      : "bg-stone-50/60 border border-stone-100 opacity-50"
                  }`}
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    included ? "bg-emerald-100" : "bg-stone-200"
                  }`}>
                    {included ? (
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <span className={included ? "text-stone-700" : "text-stone-400"}>{row.feature}</span>
                </motion.div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* ════════ ROADMAP TIMELINE ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Roadmap
          </h2>
          <p className="text-sm text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We&rsquo;re actively building. Here&rsquo;s where we are and
            what&rsquo;s next.
          </p>

          <div className="max-w-3xl mx-auto overflow-x-auto pb-2">
            <div className="flex items-center justify-center gap-0 min-w-[500px]">
              {roadmapSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.35 }}
                    className="flex flex-col items-center"
                  >
                    {/* Node */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === "done"
                          ? "bg-emerald-500 text-white"
                          : step.status === "current"
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {step.status === "done" ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : step.status === "current" ? (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      ) : (
                        <div className="w-2 h-2 bg-stone-400 rounded-full" />
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className={`mt-2.5 text-[11px] font-medium max-w-[80px] leading-tight ${
                        step.status === "done"
                          ? "text-emerald-700"
                          : step.status === "current"
                          ? "text-amber-700"
                          : "text-stone-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                  {/* Connector line */}
                  {i < roadmapSteps.length - 1 && (
                    <div
                      className={`w-10 sm:w-14 h-0.5 mx-1 rounded-full ${
                        step.status === "done" ? "bg-emerald-300" : "bg-stone-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
              Pro launch: 2026
            </span>
            <a
              href="/register"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
            >
              Register to get notified &rarr;
            </a>
          </div>
        </section>
      </FadeIn>

      {/* ════════ ROLE SELECTOR (Intended Users) ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Built For You
          </h2>
          <p className="text-sm text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Select your role to see how CivilCalc.my fits your workflow.
          </p>

          {/* Role tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-7">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium border transition-all ${
                  activeRole === r.id
                    ? "bg-amber-600 text-white border-amber-600 shadow-md"
                    : "bg-white/80 text-stone-700 border-stone-200 hover:border-amber-300 hover:shadow-sm"
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          {/* Active pitch */}
          {roles.map((r) =>
            r.id === activeRole ? (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm p-7 text-left"
              >
                <p className="text-sm text-stone-600 leading-relaxed">{r.pitch}</p>
                <a
                  href="/calculators"
                  className="inline-block mt-5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Try a calculator &rarr;
                </a>
              </motion.div>
            ) : null
          )}
        </section>
      </FadeIn>

      {/* ════════ STANDARDS & AUTHORITIES — BADGE GRID ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Standards &amp; Authorities
          </h2>
          <p className="text-sm text-stone-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Calculator outputs follow Malaysian design manuals and are generally
            acceptable for submissions to these authorities.
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {authorities.map((a) => (
              <div
                key={a.abbr}
                onMouseEnter={() => setHoveredAuthority(a.abbr)}
                onMouseLeave={() => setHoveredAuthority(null)}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200 shadow-sm px-6 py-3.5 cursor-default transition-colors hover:border-amber-300"
                >
                  <div className="text-sm font-bold text-stone-700">{a.abbr}</div>
                </motion.div>
                {/* Tooltip */}
                {hoveredAuthority === a.abbr && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-stone-800 text-white text-xs rounded-xl px-3.5 py-2 whitespace-nowrap z-10 shadow-lg"
                  >
                    {a.desc}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-stone-800 rotate-45" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ════════ WHO'S BEHIND ════════ */}
      <FadeIn>
        <section className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-stone-800 mb-5">
            Who&rsquo;s Behind CivilCalc.my
          </h2>

          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200 shadow-sm p-9 overflow-hidden">
            {/* Decorative warm accent */}
            <div className="absolute -right-8 -top-8 w-36 h-36 opacity-[0.06]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-amber-700">
                <circle cx="50" cy="50" r="48" />
              </svg>
            </div>
            <div className="absolute -left-6 -bottom-6 w-28 h-28 opacity-[0.04]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-amber-700">
                <circle cx="50" cy="50" r="48" />
              </svg>
            </div>

            <p className="text-[15px] text-stone-600 leading-relaxed relative z-10">
              CivilCalc.my is built by Malaysian civil engineers with hands-on
              experience in infrastructure design, construction supervision, and
              engineering education. Our goal is to make standards-compliant
              calculations faster and more accessible for every engineer in
              Malaysia.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-amber-50/60 rounded-full border border-amber-200/60 px-5 py-2">
              <span className="text-lg">&#x1F1F2;&#x1F1FE;</span>
              <span className="text-xs font-medium text-stone-600">Built in Malaysia</span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ════════ DISCLAIMER ALERT BOX ════════ */}
      <FadeIn>
        <section className="border-t border-stone-200 pt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-stone-800 mb-5">
            Disclaimer &amp; Professional Responsibility
          </h2>

          {/* Alert banner */}
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/60 px-6 py-5 mb-6">
            <p className="text-sm font-semibold text-amber-800 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Engineering Aid Only
            </p>
            <p className="mt-1.5 text-sm text-amber-700">
              All results require verification and endorsement by a{" "}
              <strong>BEM-registered Professional Engineer with PEPC</strong>.
            </p>
          </div>

          <div className="inline-block text-left">
            <ul className="list-disc list-inside space-y-2 text-sm text-stone-600 leading-relaxed">
              <li>
                Calculators implement simplified procedures from Malaysian manuals
                and do not replace full engineering analysis or professional
                judgement.
              </li>
              <li>
                Users must verify inputs, results, and compliance with applicable
                laws.
              </li>
              <li>
                Applicable legislation includes the Street, Drainage and Building
                Act&nbsp;1974, Sewerage Services Act&nbsp;1994, and
                UBBL&nbsp;1984.
              </li>
              <li>
                Final designs require endorsement by a BEM-registered Professional
                Engineer holding a valid Practising Certificate (PEPC).
              </li>
            </ul>
          </div>
        </section>
      </FadeIn>
    </article>
  );
}
