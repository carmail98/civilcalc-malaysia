import Link from "next/link";

const calculators = [
  {
    name: "Water Demand Calculation",
    description: "Calculate domestic, commercial, and industrial water demand with NRW allowance and peak factors per SPAN guidelines.",
    href: "/calculators/environmental/water-demand",
    standard: "SPAN Guidelines",
  },
  {
    name: "EIA Screening Checklist",
    description: "Check project against EIA Order 2015 thresholds to determine if PEIA or DEIA is required.",
    href: "/calculators/environmental/eia-screening",
    standard: "DOE EIA Order 2015",
  },
];

export default function EnvironmentalCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Environmental / SPAN Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Water demand estimation and environmental impact assessment screening per SPAN and DOE Malaysia requirements.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-emerald-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-400"
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
