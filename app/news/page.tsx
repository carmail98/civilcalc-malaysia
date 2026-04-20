"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const updates = [
  {
    date: "20 Apr 2026",
    title: "Role tagging and UX audit fixes shipped",
    items: [
      "Every calculator is now tagged as Consultant, Contractor, or both — filter the index by your role with the new 'I am a' selector, and see role chips on every card.",
      "Fixed IDF Rainfall Intensity: duration is now correctly converted from minutes to the MSMA HP1 published form (hours). Kuala Lumpur 10-yr / 60-min intensity now reads within the expected 70–90 mm/hr band (previously under-reported by a factor of ~30).",
      "New on-brand 404 page with a search box, 'Browse All Calculators' CTA, and a 'Report a broken link' shortcut that pre-fills the feedback form.",
      "Fixed broken URL /calculators/concrete/rc-beam — now redirects to the correct /calculators/concrete/beam-moment page.",
      "Every calculator now has a 'Reset inputs' button in the save bar to clear all fields at once.",
      "Each result card now shows a condensed BEM disclaimer line and a 'Calculated HH:MM' timestamp so you always know the result reflects your current inputs.",
      "Navigation now highlights your current section with an amber underline, and the homepage 'Explore Calculators' CTA is given clearer visual priority.",
      "Homepage 'Request a Calculator' card now opens the feedback form with the category and a request template pre-filled.",
    ],
  },
  {
    date: "15 Apr 2026",
    title: "Major Update — 17 new calculators deployed (36 total)",
    items: [
      "New Geotechnical category: Bearing Capacity (Terzaghi/Meyerhof), Settlement Calculation, Slope Stability (FOS), Pile Capacity — all per MS EN 1997-1 and JKR guidelines.",
      "New QS/Costing category: Preliminary Cost Estimate (PCE), Build-up of Rates, Variation Order (VO), Tender Evaluation, Interim Payment Certificate (IPC), Final Account Summary — per BQSM, JKR SMM2, PWD 203A, and MOF procurement guidelines.",
      "New Environmental category: Water Demand Calculation (SPAN guidelines) and EIA Screening Checklist (DOE EIA Order 2015).",
      "New Structural tools: RC Slab Design (one-way & two-way per EC2) and Deflection Check (span/depth ratio per EC2 Cl. 7.4.2).",
      "New Roads tools: Sight Distance Calculator (SSD & OSD), Road Gradient & Curve Design, Traffic Volume (PCU) & LOS — per JKR ATJ 8/86 and REAM.",
      "Updated homepage, category pages, footer navigation, and standards trust bar to reflect all 36 calculators across 9 categories.",
    ],
  },
  {
    date: "23 Mar 2026",
    title: "Project kick-off — 19 initial calculators launched",
    items: [
      "Launched 19 calculators covering drainage (MSMA 2nd Ed), earthworks (JKR), roads (ATJ 5/85), sewerage (MSIG/SPAN), and structural (MS EN 1992-1-1).",
      "Implemented shared input/output layout with save/load, PDF export, and cloud sync.",
      "All calculators include Malaysian standard references, key terms, and PE disclaimer per BEM requirements.",
    ],
  },
];

const comingNext = [
  "Retaining wall design calculator (MS EN 1997 / BS 8002).",
  "Staircase design calculator (EC2 slab method).",
  "Bill of Quantities (BQ) generator from calculator results.",
  "Community-contributed calculators with PE review workflow.",
  "Mobile-responsive improvements and offline mode (PWA).",
];

/* ═══════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════ */

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */

export default function NewsPage() {
  return (
    <article className="space-y-20 text-center pb-12">
      {/* ════════ HERO ════════ */}
      <FadeIn>
        <header className="py-16 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-transparent -mx-4 px-6 rounded-b-3xl">
          <p className="text-sm font-medium tracking-wide text-amber-600/80 uppercase mb-3">
            Stay Updated
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
            News &amp; Updates
          </h1>
          <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            New calculators, feature improvements, and Malaysian standard
            revisions — all in one place.
          </p>
        </header>
      </FadeIn>

      {/* ════════ STATUS BANNER ════════ */}
      <FadeIn>
        <section className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/60 px-6 py-5">
            <div className="flex items-baseline justify-between flex-wrap gap-x-4">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Status: Public Beta (2026)
              </p>
              <p className="text-xs text-amber-600">
                Last updated: 20 Apr 2026
              </p>
            </div>
            <p className="mt-2 text-sm text-amber-700 leading-relaxed">
              CivilCalc.online now features 36 free calculators across 9
              categories, all built on Malaysian standards. We are actively
              testing and refining — your feedback helps us improve!
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ════════ LATEST UPDATES ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Latest Updates
          </h2>
          <p className="text-sm text-stone-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Recent changes and progress on CivilCalc.online.
          </p>

          <div className="max-w-2xl mx-auto space-y-4">
            {updates.map((update, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm p-6 text-left hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-amber-50/60 rounded-full border border-amber-200/60 px-3.5 py-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-amber-700">
                      {update.date}
                    </span>
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  {update.title}
                </h3>
                <ul className="space-y-1.5">
                  {update.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ════════ WHAT'S COMING NEXT ════════ */}
      <FadeIn>
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            What&rsquo;s Coming Next
          </h2>
          <p className="text-sm text-stone-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Planned features and improvements on our roadmap.
          </p>

          <div className="max-w-2xl mx-auto space-y-2.5">
            {comingNext.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200 px-5 py-3.5 text-left hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-stone-400 rounded-full" />
                </div>
                <span className="text-sm text-stone-600">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ════════ CTA ════════ */}
      <FadeIn>
        <section className="max-w-2xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200 shadow-sm p-9 overflow-hidden">
            {/* Decorative warm accent */}
            <div className="absolute -right-8 -top-8 w-36 h-36 opacity-[0.06]">
              <svg
                viewBox="0 0 100 100"
                fill="currentColor"
                className="w-full h-full text-amber-700"
              >
                <circle cx="50" cy="50" r="48" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-stone-800 mb-3">
              Help Shape CivilCalc.online
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed mb-6">
              Want to influence what we build first? Share your feedback,
              request a calculator, or join the conversation.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/community"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-700 hover:shadow-lg transition-all"
              >
                Join the Community
              </a>
              <a
                href="/calculators"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white/80 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-stone-700 shadow-sm hover:bg-white hover:shadow transition-all"
              >
                Browse Calculators
              </a>
            </div>
          </div>
        </section>
      </FadeIn>
    </article>
  );
}
