import Link from "next/link";

const calculators = [
  {
    name: "Rational Method — Peak Flow",
    description: "Peak stormwater flow using MSMA Rational Method (Q = CiA/360). Valid for catchments ≤ 80 ha.",
    href: "/calculators/drainage/rational-method",
    standard: "MSMA 2nd Ed, Ch 2, Eq. 2.3",
  },
  {
    name: "IDF Curve — Rainfall Intensity",
    description: "Rainfall intensity from MSMA Eq. 2.2 with official λ/κ/θ/η constants for 13 major Malaysian stations.",
    href: "/calculators/drainage/idf",
    standard: "MSMA 2nd Ed, Table 2.B1",
  },
  {
    name: "Time of Concentration (Tc)",
    description: "Compute tc using overland + drain flow time per MSMA Table 2.1 (QUDM, 2007). Slope in %.",
    href: "/calculators/drainage/tc",
    standard: "MSMA 2nd Ed, Ch 2, Table 2.1",
  },
  {
    name: "Manning's Drain Sizing",
    description: "Size rectangular & trapezoidal open channel drains with MSMA velocity/freeboard checks.",
    href: "/calculators/drainage/drain-sizing",
    standard: "MSMA 2nd Ed, Ch 14 & 16",
  },
  {
    name: "Culvert Hydraulic Design",
    description: "Preliminary box (RCBC) and pipe (RCP) culvert sizing (full-flow approximation).",
    href: "/calculators/drainage/culvert",
    standard: "MSMA 2nd Ed, Ch 18",
  },
  {
    name: "Detention Pond Volume",
    description: "Volume estimate using pre/post-development Rational Method flows over storm duration.",
    href: "/calculators/drainage/detention-pond",
    standard: "MSMA 2nd Ed, Ch 7",
  },
  {
    name: "On-Site Detention (OSD)",
    description: "Simplified PSD + SSR sizing using MSMA Table 5.A1 Five Regions with impervious % interpolation.",
    href: "/calculators/drainage/osd",
    standard: "MSMA 2nd Ed, Ch 5 §5.8.3",
  },
  {
    name: "Rainwater Harvesting Tank",
    description: "Tank sizing per MSMA Eq. 6.1 plus AARY for 17 Malaysian towns (Table 6.4).",
    href: "/calculators/drainage/rwh",
    standard: "MSMA 2nd Ed, Ch 6",
  },
  {
    name: "Bioretention System",
    description: "Filter bed area sizing (Eq 9.1 / 9.2) for water quality treatment — 3-month ARI WQv.",
    href: "/calculators/drainage/bioretention",
    standard: "MSMA 2nd Ed, Ch 9",
  },
];

export default function DrainageCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Drainage Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Stormwater hydrology, IDF curves, drain sizing, culvert design, and detention ponds per MSMA 2nd Edition and JPS guidelines.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-sky-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-sky-400"
          >
            <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
              {calc.name}
            </h3>
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
              {calc.description}
            </p>
            <p className="mt-2 text-xs text-stone-400">{calc.standard}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
