import Link from "next/link";

const calculators = [
  {
    name: "Sewer Pipe Sizing (MSIG/SPAN)",
    description: "Calculate DWF, Harmon's peak factor, design flow, and check pipe capacity per MSIG guidelines.",
    href: "/calculators/sewerage/sewer-sizing",
    standard: "MSIG / SPAN UTG",
  },
];

export default function SewerageCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Sewerage Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Sewer pipe sizing and capacity checks per MSIG and SPAN technical guidelines.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-green-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-green-400"
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
