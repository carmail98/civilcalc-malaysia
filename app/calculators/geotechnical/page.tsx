import Link from "next/link";

const calculators = [
  {
    name: "Bearing Capacity Calculator",
    description: "Calculate ultimate and allowable bearing capacity using Terzaghi or Meyerhof methods.",
    href: "/calculators/geotechnical/bearing-capacity",
    standard: "MS EN 1997-1 (EC7)",
  },
  {
    name: "Settlement Calculation",
    description: "1D consolidation settlement for normally and over-consolidated soils with time estimates.",
    href: "/calculators/geotechnical/settlement",
    standard: "MS EN 1997-1, Terzaghi Theory",
  },
  {
    name: "Slope Stability (FOS)",
    description: "Infinite slope factor of safety with optional water table effect per JKR guidelines.",
    href: "/calculators/geotechnical/slope-stability",
    standard: "MS EN 1997-1 / JKR Guidelines",
  },
  {
    name: "Pile Capacity",
    description: "Friction plus end-bearing capacity for bored and driven piles in cohesive or granular soils.",
    href: "/calculators/geotechnical/pile-capacity",
    standard: "MS EN 1997-1 / JKR Piling",
  },
];

export default function GeotechnicalCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Geotechnical Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Bearing capacity, settlement, slope stability, and pile design per MS EN 1997-1 (Eurocode 7) and JKR geotechnical practice.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-yellow-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-yellow-400"
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
