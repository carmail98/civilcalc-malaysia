"use client";

import Link from "next/link";
import { useState } from "react";

/* ── Category config: colors & icons ── */
const categoryConfig: Record<
  string,
  { bg: string; text: string; border: string; hoverBorder: string; icon: React.ReactNode }
> = {
  Drainage: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 01.894.553l1.276 2.553a1 1 0 01-.073.992L10 9.5l-2.097-3.402a1 1 0 01-.073-.992l1.276-2.553A1 1 0 0110 2zM6 12a4 4 0 108 0c0 2.5-4 5-4 5s-4-2.5-4-5z" />
      </svg>
    ),
  },
  Earthworks: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656zM10 4.929L8.586 6.343 10 7.757l1.414-1.414L10 4.929z" />
        <path fillRule="evenodd" d="M2 17a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  Roads: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    border: "border-gray-300",
    hoverBorder: "hover:border-gray-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 3.636a1 1 0 011.06.147l.74.656.74-.656a1 1 0 011.06-.147L10 4.5l1.35-.864a1 1 0 011.06.147l.74.656.74-.656A1 1 0 0115.95 4.5V16a1 1 0 01-1.65.76l-.74-.656-.74.656a1 1 0 01-1.06.147L10 16l-1.35.864a1 1 0 01-1.06-.147l-.74-.656-.74.656A1 1 0 014.05 16V4.5a1 1 0 011-1.136z" clipRule="evenodd" />
      </svg>
    ),
  },
  Sewerage: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    hoverBorder: "hover:border-green-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7.586 5H4a1 1 0 000 2h4l-1 8H4a1 1 0 000 2h12a1 1 0 100-2h-3l-1-8h4a1 1 0 100-2h-3.586l1.293-1.293A1 1 0 0013 2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
  Structural: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4zm2 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
};

const calculators = [
  {
    name: "Rational Method — Peak Flow",
    description: "Calculate peak stormwater flow using MSMA 2nd Edition rational method (Q = CiA/360).",
    href: "/calculators/drainage",
    standard: "MSMA 2nd Ed, Ch 2",
    category: "Drainage",
  },
  {
    name: "IDF Curve — Rainfall Intensity",
    description: "Look up rainfall intensity from IDF equation with presets for major Malaysian stations and full ARI/duration table.",
    href: "/calculators/drainage/idf",
    standard: "MSMA 2nd Ed & DID HP1",
    category: "Drainage",
  },
  {
    name: "Time of Concentration (Tc)",
    description: "Compute tc using Friend's formula for overland flow and drain travel time.",
    href: "/calculators/drainage/tc",
    standard: "MSMA 2nd Ed, Ch 2",
    category: "Drainage",
  },
  {
    name: "Manning's Drain Sizing",
    description: "Size rectangular & trapezoidal open channel drains using Manning's equation with MSMA velocity checks.",
    href: "/calculators/drainage/drain-sizing",
    standard: "MSMA 2nd Ed, Ch 14 & 16",
    category: "Drainage",
  },
  {
    name: "Culvert Hydraulic Design",
    description: "Size box (RCBC) and pipe (RCP) culverts using Manning's full-flow equation with adequacy check.",
    href: "/calculators/drainage/culvert",
    standard: "MSMA 2nd Ed, Ch 36 & REAM Vol 4",
    category: "Drainage",
  },
  {
    name: "Detention Pond Volume (MSMA)",
    description: "Size detention storage using MSMA simplified rational method with pre/post-development flow comparison.",
    href: "/calculators/drainage/detention-pond",
    standard: "MSMA 2nd Ed, Ch 5",
    category: "Drainage",
  },
  {
    name: "Earthworks Cut & Fill Volume",
    description: "Calculate earthworks volume using Average End Area or Prismoidal method.",
    href: "/calculators/earthworks",
    standard: "JKR Earthworks Manual",
    category: "Earthworks",
  },
  {
    name: "Slope Gradient & Batter",
    description: "Convert slope to ratio, percentage, and angle with JKR advisory checks.",
    href: "/calculators/earthworks/slope",
    standard: "JKR / MASMA",
    category: "Earthworks",
  },
  {
    name: "Dry Density & Compaction Check",
    description: "Check field compaction against MDD requirement per JKR Spec S/4.",
    href: "/calculators/earthworks/compaction",
    standard: "JKR Spec S/4",
    category: "Earthworks",
  },
  {
    name: "Flexible Pavement Design (JKR)",
    description: "Calculate ESAL, determine traffic category, and get recommended pavement layer thicknesses per JKR ATJ 5/85.",
    href: "/calculators/roads/pavement",
    standard: "JKR ATJ 5/85 (Rev 2013)",
    category: "Roads",
  },
  {
    name: "Road Carriageway Width Check",
    description: "Verify carriageway width against ATJ 8/86 lane width requirements.",
    href: "/calculators/roads",
    standard: "ATJ 8/86",
    category: "Roads",
  },
  {
    name: "Sewer Pipe Sizing (MSIG/SPAN)",
    description: "Calculate DWF, Harmon's peak factor, design flow, and check pipe capacity per MSIG guidelines.",
    href: "/calculators/sewerage",
    standard: "MSIG / SPAN UTG",
    category: "Sewerage",
  },
  {
    name: "Load Take-Off (Slab to Beam)",
    description: "Calculate ULS design load and line load on beam per EC1 Malaysia NA.",
    href: "/calculators/concrete/load-takeoff",
    standard: "MS EN 1991-1-1",
    category: "Structural",
  },
  {
    name: "RC Beam Moment Capacity",
    description: "Determine beam moment capacity and utilisation check per EC2 Malaysia NA.",
    href: "/calculators/concrete",
    standard: "MS EN 1992-1-1",
    category: "Structural",
  },
];

const categories = ["All", "Drainage", "Earthworks", "Roads", "Sewerage", "Structural"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = calculators.filter((calc) => {
    const matchesCategory = activeFilter === "All" || calc.category === activeFilter;
    const matchesSearch =
      search === "" ||
      calc.name.toLowerCase().includes(search.toLowerCase()) ||
      calc.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryCount = (cat: string) =>
    calculators.filter((c) => c.category === cat).length;

  return (
    <div>
      {/* Hero section */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CivilCalc Malaysia
        </h1>
        <p className="text-gray-600 max-w-2xl mb-4">
          Free civil engineering calculators based on Malaysian standards — MSMA,
          JKR, MS EN. Built for engineers, students, and consultants.
        </p>
        <p className="text-sm text-gray-400 mb-5">
          {calculators.length} calculators across {categories.length - 1} categories
        </p>

        {/* Search bar */}
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search calculators..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
          />
        </div>
      </section>

      {/* Filter tabs */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            const config = cat !== "All" ? categoryConfig[cat] : null;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? config
                      ? `${config.bg} ${config.text}`
                      : "bg-gray-900 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">{categoryCount(cat)}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Calculator cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((calc) => {
            const config = categoryConfig[calc.category];
            return (
              <Link
                key={calc.href}
                href={calc.href}
                className={`group block rounded-lg border bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${config.border} ${config.hoverBorder}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${config.bg} ${config.text}`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-1.5 ${config.bg} ${config.text}`}
                    >
                      {calc.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {calc.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                      {calc.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">{calc.standard}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No calculators found. Try a different search or filter.
          </div>
        )}
      </section>
    </div>
  );
}
