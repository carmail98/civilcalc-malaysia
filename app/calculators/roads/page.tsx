import Link from "next/link";

const calculators = [
  {
    name: "Flexible Pavement Design (JKR)",
    description: "ESAL calculation, traffic category, and recommended pavement layer thicknesses per JKR ATJ 5/85.",
    href: "/calculators/roads/pavement",
    standard: "JKR ATJ 5/85 (Rev 2013)",
  },
  {
    name: "Road Carriageway Width Check",
    description: "Verify carriageway width against ATJ 8/86 lane width requirements for rural and urban roads.",
    href: "/calculators/roads/width-check",
    standard: "ATJ 8/86",
  },
];

export default function RoadsCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Roads Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Pavement design and carriageway width compliance checks per JKR standard specifications.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-stone-300 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-stone-400"
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
