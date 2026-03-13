import Link from "next/link";

const calculators = [
  {
    name: "Rational Method — Peak Flow",
    description: "Calculate peak stormwater flow using MSMA 2nd Edition rational method (Q = CiA/360).",
    href: "/calculators/drainage",
    standard: "MSMA 2nd Ed, Ch 2",
    category: "Drainage",
  },
];

const upcoming = [
  { name: "Time of Concentration (Tc)", standard: "MSMA 2nd Ed, Ch 2" },
  { name: "Earthworks Cut & Fill Volume", standard: "JKR Earthworks" },
  { name: "Slope Gradient & Batter", standard: "JKR / MASMA" },
  { name: "RC Beam Moment Capacity", standard: "MS EN 1992-1-1" },
  { name: "Road Carriageway Width Check", standard: "JKR Road Design" },
  { name: "Load Take-Off (Slab/Beam)", standard: "MS EN 1991-1-1" },
  { name: "Dry Density & Compaction Check", standard: "JKR Spec S/4" },
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

      <section className="mb-12">
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

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Coming Soon
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((calc) => (
            <div
              key={calc.name}
              className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
            >
              <h3 className="text-sm font-medium text-gray-600">
                {calc.name}
              </h3>
              <p className="text-xs text-gray-400">{calc.standard}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
