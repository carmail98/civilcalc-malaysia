import Link from "next/link";

/* ── Featured calculators (top 6 most useful) ── */
const featured = [
  {
    name: "Rational Method — Peak Flow",
    description: "Peak stormwater flow using MSMA rational method (Q = CiA/360).",
    href: "/calculators/drainage/rational-method",
    standard: "MSMA 2nd Ed",
    category: "Drainage",
    color: "blue",
  },
  {
    name: "RC Slab Design (One-Way & Two-Way)",
    description: "Design slabs with moment coefficients, steel area, and deflection check per EC2.",
    href: "/calculators/concrete/slab-design",
    standard: "MS EN 1992-1-1",
    category: "Structural",
    color: "orange",
  },
  {
    name: "Bearing Capacity Calculator",
    description: "Terzaghi & Meyerhof bearing capacity with shape and depth factors.",
    href: "/calculators/geotechnical/bearing-capacity",
    standard: "MS EN 1997-1",
    category: "Geotechnical",
    color: "amber",
  },
  {
    name: "Preliminary Cost Estimate (PCE)",
    description: "Building cost from GFA with location, storey, and inflation adjustments.",
    href: "/calculators/costing/pce",
    standard: "JKR / BQSM / CIDB",
    category: "Costing",
    color: "green",
  },
  {
    name: "Flexible Pavement Design",
    description: "ESAL calculation, traffic category, and layer thicknesses per JKR ATJ 5/85.",
    href: "/calculators/roads/pavement",
    standard: "JKR ATJ 5/85",
    category: "Roads",
    color: "gray",
  },
  {
    name: "Water Demand Calculation",
    description: "Domestic, commercial & industrial demand with NRW and peak factors per SPAN.",
    href: "/calculators/environmental/water-demand",
    standard: "SPAN Guidelines",
    category: "Environmental",
    color: "green",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-sky-100/70", text: "text-sky-700", border: "border-sky-200/60" },
  amber: { bg: "bg-amber-100/70", text: "text-amber-700", border: "border-amber-200/60" },
  gray: { bg: "bg-stone-200/70", text: "text-stone-700", border: "border-stone-300/60" },
  green: { bg: "bg-emerald-100/70", text: "text-emerald-700", border: "border-emerald-200/60" },
  orange: { bg: "bg-orange-100/70", text: "text-orange-700", border: "border-orange-200/60" },
};

/* ── Category cards ── */
const categoryCards = [
  {
    name: "Drainage",
    count: 9,
    description: "Stormwater, IDF curves, drains, culverts, detention, OSD, RWH, bioretention",
    href: "/calculators?cat=Drainage",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 01.894.553l1.276 2.553a1 1 0 01-.073.992L10 9.5l-2.097-3.402a1 1 0 01-.073-.992l1.276-2.553A1 1 0 0110 2zM6 12a4 4 0 108 0c0 2.5-4 5-4 5s-4-2.5-4-5z" />
      </svg>
    ),
    bg: "bg-sky-50/60",
    text: "text-sky-700",
    border: "border-sky-200/60",
    hoverBorder: "hover:border-sky-400",
  },
  {
    name: "Earthworks",
    count: 3,
    description: "Cut & fill volumes, slope gradients, compaction checks",
    href: "/calculators?cat=Earthworks",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656zM10 4.929L8.586 6.343 10 7.757l1.414-1.414L10 4.929z" />
        <path fillRule="evenodd" d="M2 17a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
  },
  {
    name: "Roads",
    count: 5,
    description: "Pavement design, sight distance, gradient & curve, traffic volume (PCU)",
    href: "/calculators?cat=Roads",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 3.636a1 1 0 011.06.147l.74.656.74-.656a1 1 0 011.06-.147L10 4.5l1.35-.864a1 1 0 011.06.147l.74.656.74-.656A1 1 0 0115.95 4.5V16a1 1 0 01-1.65.76l-.74-.656-.74.656a1 1 0 01-1.06.147L10 16l-1.35.864a1 1 0 01-1.06-.147l-.74-.656-.74.656A1 1 0 014.05 16V4.5a1 1 0 011-1.136z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-stone-100/60",
    text: "text-stone-700",
    border: "border-stone-300/60",
    hoverBorder: "hover:border-stone-400",
  },
  {
    name: "Sewerage",
    count: 1,
    description: "Sewer pipe sizing per MSIG/SPAN guidelines",
    href: "/calculators?cat=Sewerage",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7.586 5H4a1 1 0 000 2h4l-1 8H4a1 1 0 000 2h12a1 1 0 100-2h-3l-1-8h4a1 1 0 100-2h-3.586l1.293-1.293A1 1 0 0013 2H7z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    hoverBorder: "hover:border-green-400",
  },
  {
    name: "Structural",
    count: 8,
    description: "Slab, beam, column, footing, shear, deflection, crack width (Eurocode)",
    href: "/calculators?cat=Structural",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4zm2 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
  },
  {
    name: "Geotechnical",
    count: 4,
    description: "Bearing capacity, settlement, slope stability, pile capacity",
    href: "/calculators?cat=Geotechnical",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    hoverBorder: "hover:border-yellow-400",
  },
  {
    name: "QS / Costing",
    count: 6,
    description: "Cost estimates, build-up rates, VO, tender evaluation, IPC, final account",
    href: "/calculators?cat=Costing",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    hoverBorder: "hover:border-teal-400",
  },
  {
    name: "Environmental",
    count: 2,
    description: "Water demand (SPAN) and EIA screening (DOE)",
    href: "/calculators?cat=Environmental",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 01.894.553l1.276 2.553a1 1 0 01-.073.992L10 9.5l-2.097-3.402a1 1 0 01-.073-.992l1.276-2.553A1 1 0 0110 2zM6 12a4 4 0 108 0c0 2.5-4 5-4 5s-4-2.5-4-5z" clipRule="evenodd" />
      </svg>
    ),
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
  },
];

/* ── Standards trust bar ── */
const standards = [
  { abbr: "MSMA", full: "Manual Saliran Mesra Alam", org: "DID Malaysia" },
  { abbr: "JKR", full: "Jabatan Kerja Raya", org: "Public Works Dept" },
  { abbr: "MS EN", full: "Malaysian Eurocode (EC2/EC7)", org: "Dept of Standards" },
  { abbr: "SPAN", full: "Water & Sewerage Commission", org: "SPAN / MSIG" },
  { abbr: "DOE", full: "Dept of Environment", org: "EIA Order 2015" },
  { abbr: "BQSM", full: "Board of Quantity Surveyors", org: "PWD 203A / SMM2" },
];

/* ── How it works steps ── */
const steps = [
  {
    num: "1",
    title: "Choose a Calculator",
    description: "Pick from 39 tools covering drainage, earthworks, roads, structural, geotechnical, costing, and environmental.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Enter Your Parameters",
    description: "Input design values — catchment area, pipe diameter, beam dimensions, and more.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Get Compliant Results",
    description: "Receive instant results with code-compliance checks against Malaysian standards.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

/* ── What's New ── */
const updates = [
  {
    date: "Apr 2026",
    title: "17 new calculators deployed across 3 new categories",
    description: "Geotechnical (bearing capacity, settlement, slope stability, pile capacity), QS/Costing (PCE, build-up rates, VO, tender evaluation, IPC, final account), Environmental (water demand, EIA screening), plus slab design, deflection check, sight distance, road curves, and traffic PCU.",
    badge: "Major Update",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    date: "Mar 2026",
    title: "19 initial calculators launched",
    description: "First release covering drainage (MSMA), earthworks (JKR), roads (ATJ 5/85), sewerage (MSIG/SPAN), and structural (MS EN 1992) calculators.",
    badge: "Launch",
    badgeColor: "bg-green-100 text-green-700",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-800 px-6 py-14 sm:px-12 sm:py-20 text-white">
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative engineering illustration */}
        <div className="pointer-events-none absolute right-0 bottom-0 opacity-[0.07] hidden sm:block">
          <svg width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Road profile */}
            <path d="M20 220 L60 180 L120 180 L140 160 L200 160 L220 180 L280 180 L300 220" stroke="white" strokeWidth="2.5" fill="none" />
            <line x1="20" y1="220" x2="300" y2="220" stroke="white" strokeWidth="2" />
            {/* Drain cross-section */}
            <rect x="60" y="180" width="40" height="40" stroke="white" strokeWidth="2" fill="none" rx="2" />
            <rect x="220" y="180" width="40" height="40" stroke="white" strokeWidth="2" fill="none" rx="2" />
            {/* Water level markers */}
            <path d="M65 200 Q70 196 75 200 Q80 204 85 200 Q90 196 95 200" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M225 200 Q230 196 235 200 Q240 204 245 200 Q250 196 255 200" stroke="white" strokeWidth="1.5" fill="none" />
            {/* Dimension lines */}
            <line x1="60" y1="170" x2="100" y2="170" stroke="white" strokeWidth="1" />
            <line x1="60" y1="168" x2="60" y2="172" stroke="white" strokeWidth="1" />
            <line x1="100" y1="168" x2="100" y2="172" stroke="white" strokeWidth="1" />
            {/* Building/beam outline */}
            <rect x="130" y="100" width="60" height="60" stroke="white" strokeWidth="2" fill="none" />
            <line x1="130" y1="130" x2="190" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="160" y1="100" x2="160" y2="160" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
            {/* Rebar dots */}
            <circle cx="140" cy="150" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="160" cy="150" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="180" cy="150" r="3" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Civil Engineering Calculators for Malaysia
          </h1>
          <p className="text-amber-100 text-lg leading-relaxed mb-8">
            39 free tools built on MSMA, JKR, MS EN, SPAN, DOE, and BQSM standards.
            Get instant, code-compliant results across 9 categories — drainage,
            earthworks, roads, structural, geotechnical, costing, and more.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-amber-800 px-7 py-3.5 text-base font-semibold shadow-xl hover:bg-amber-50 transition-colors"
            >
              Explore Calculators
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-100/90 hover:text-white transition-colors underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-200"
            >
              Learn about our standards
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Standards Trust Bar ─── */}
      <section>
        <p className="text-xs font-medium text-stone-400 text-center uppercase tracking-wider mb-5">
          Built on Malaysian Standards
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {standards.map((s) => (
            <div
              key={s.abbr}
              className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-center"
            >
              <p className="text-sm font-bold text-stone-800">{s.abbr}</p>
              <p className="text-xs text-stone-500 mt-0.5">{s.full}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Calculators ─── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Popular Calculators</h2>
            <p className="text-sm text-stone-500 mt-1">Most used tools by Malaysian engineers</p>
          </div>
          <Link
            href="/calculators"
            className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            View all 36
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((calc) => {
            const c = colorMap[calc.color];
            return (
              <Link
                key={calc.href}
                href={calc.href}
                className={`group block rounded-2xl border bg-white/80 backdrop-blur-sm p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${c.border}`}
              >
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-2 ${c.bg} ${c.text}`}>
                  {calc.category}
                </span>
                <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                  {calc.name}
                </h3>
                <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
                  {calc.description}
                </p>
                <p className="mt-2 text-xs text-stone-400">{calc.standard}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/calculators"
            className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
          >
            View all 39 tools &rarr;
          </Link>
        </div>
      </section>

      {/* ─── Browse by Category ─── */}
      <section>
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Browse by Category</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${cat.bg} ${cat.border} ${cat.hoverBorder}`}
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 ${cat.text}`}>{cat.icon}</div>
                <div>
                  <h3 className={`font-semibold ${cat.text}`}>
                    {cat.name}
                    <span className="ml-2 text-xs font-normal opacity-70">{cat.count} {cat.count === 1 ? "tool" : "tools"}</span>
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}

          {/* Request a calculator CTA */}
          <Link
            href="/feedback?category=FEATURE_REQUEST&topic=calculator-request"
            title="Open a pre-filled feedback form to suggest a new calculator"
            className="group rounded-xl border-2 border-dashed border-stone-300 p-5 transition-all hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-500 group-hover:text-amber-700 transition-colors">Request a Calculator</p>
              <p className="text-xs text-stone-400 mt-0.5">Suggest a new tool</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="rounded-3xl bg-white/80 backdrop-blur-sm border border-stone-200 px-6 py-10 sm:px-10">
        <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">How It Works</h2>
        <p className="text-sm text-stone-500 text-center mb-10">
          Three simple steps to code-compliant results
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/60 text-amber-700">
                {step.icon}
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">
                <span className="text-amber-600 mr-1">{step.num}.</span>
                {step.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── What's New ─── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">What&apos;s New</h2>
          <Link
            href="/news"
            className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
          >
            All updates &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {updates.map((u) => (
            <div
              key={u.title}
              className="rounded-lg border border-stone-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.badgeColor}`}>
                  {u.badge}
                </span>
                <span className="text-xs text-stone-400">{u.date}</span>
              </div>
              <h3 className="font-semibold text-stone-800 text-sm">{u.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{u.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
