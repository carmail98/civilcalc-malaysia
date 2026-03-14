import Link from "next/link";

const calculators = [
  {
    name: "Rational Method — Peak Flow",
    description: "Calculate peak stormwater flow using MSMA 2nd Edition rational method (Q = CiA/360).",
    href: "/calculators/drainage",
    standard: "MSMA 2nd Ed, Ch 2",
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
    name: "Road Carriageway Width Check",
    description: "Verify carriageway width against ATJ 8/86 lane width requirements.",
    href: "/calculators/roads",
    standard: "ATJ 8/86",
    category: "Roads",
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

export default function Home() {
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CivilCalc Malaysia
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Free civil engineering calculators based on Malaysian standards — MSMA,
          JKR, MS EN. Built for engineers, students, and consultants.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Available Calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="block rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 mb-2">
                {calc.category}
              </span>
              <h3 className="font-semibold text-gray-900">{calc.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{calc.description}</p>
              <p className="mt-2 text-xs text-gray-400">{calc.standard}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
