import Link from "next/link";

const calculators = [
  {
    name: "Preliminary Cost Estimate (PCE)",
    description: "Estimate building cost from GFA and rate per m² with location, storey, and inflation adjustments.",
    href: "/calculators/costing/pce",
    standard: "JKR / BQSM / CIDB",
  },
  {
    name: "Build-up of Rates",
    description: "Compose all-in rate from labour, material, plant, overhead, and profit components.",
    href: "/calculators/costing/buildup-rates",
    standard: "BQSM / JKR SMM2",
  },
  {
    name: "Variation Order (VO) Calculator",
    description: "Calculate net VO value with additions, omissions, and daywork against the 30% JKR limit.",
    href: "/calculators/costing/variation-order",
    standard: "PWD Form 203A",
  },
  {
    name: "Tender Evaluation",
    description: "Weighted scoring method combining technical merit and price competitiveness per MOF guidelines.",
    href: "/calculators/costing/tender-evaluation",
    standard: "MOF Procurement Guidelines",
  },
  {
    name: "Interim Payment Certificate (IPC)",
    description: "Calculate amount due with retention, advance recovery, and materials on site per PWD 203A.",
    href: "/calculators/costing/ipc",
    standard: "PWD Form 203A",
  },
  {
    name: "Final Account Summary",
    description: "Compile final account with VO, PS/PC adjustments, claims, and LAD deductions.",
    href: "/calculators/costing/final-account",
    standard: "PWD Form 203A",
  },
];

export default function CostingCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">QS / Costing Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Cost estimation, tendering, payment certification, and final accounts per BQSM, JKR, and MOF standards for Malaysian construction projects.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-teal-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-teal-400"
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
