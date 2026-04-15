import Link from "next/link";

const calculators = [
  {
    name: "Earthworks Cut & Fill Volume",
    description: "Calculate earthworks volume using Average End Area or Prismoidal method.",
    href: "/calculators/earthworks/cut-fill",
    standard: "JKR Earthworks Manual",
  },
  {
    name: "Slope Gradient & Batter",
    description: "Convert slope to ratio, percentage, and angle with JKR advisory checks.",
    href: "/calculators/earthworks/slope",
    standard: "JKR / MASMA",
  },
  {
    name: "Dry Density & Compaction Check",
    description: "Check field compaction against MDD requirement per JKR Spec S/4.",
    href: "/calculators/earthworks/compaction",
    standard: "JKR Spec S/4",
  },
];

export default function EarthworksCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Earthworks Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Cut & fill volumes, slope gradient checks, and compaction verification for site earthworks.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-amber-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-amber-400"
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
