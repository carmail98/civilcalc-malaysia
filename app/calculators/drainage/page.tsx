import Link from "next/link";

const calculators = [
  {
    name: "Rational Method — Peak Flow",
    description: "Peak stormwater flow using MSMA rational method (Q = CiA/360).",
    href: "/calculators/drainage/rational-method",
    standard: "MSMA 2nd Ed, Ch 2",
  },
  {
    name: "IDF Curve — Rainfall Intensity",
    description: "Look up rainfall intensity from IDF equation with presets for major Malaysian stations.",
    href: "/calculators/drainage/idf",
    standard: "MSMA 2nd Ed & DID HP1",
  },
  {
    name: "Time of Concentration (Tc)",
    description: "Compute tc using Friend's formula for overland flow and drain travel time.",
    href: "/calculators/drainage/tc",
    standard: "MSMA 2nd Ed, Ch 2",
  },
  {
    name: "Manning's Drain Sizing",
    description: "Size rectangular & trapezoidal open channel drains with MSMA velocity checks.",
    href: "/calculators/drainage/drain-sizing",
    standard: "MSMA 2nd Ed, Ch 14 & 16",
  },
  {
    name: "Culvert Hydraulic Design",
    description: "Size box (RCBC) and pipe (RCP) culverts using Manning's full-flow equation.",
    href: "/calculators/drainage/culvert",
    standard: "MSMA 2nd Ed, Ch 36 & REAM Vol 4",
  },
  {
    name: "Detention Pond Volume",
    description: "Size detention storage using MSMA simplified rational method with pre/post-development flows.",
    href: "/calculators/drainage/detention-pond",
    standard: "MSMA 2nd Ed, Ch 5",
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
