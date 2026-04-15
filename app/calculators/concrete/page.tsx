import Link from "next/link";

const calculators = [
  {
    name: "Load Take-Off (Slab to Beam)",
    description: "Calculate ULS design load and line load on beam per EC1 Malaysia NA.",
    href: "/calculators/concrete/load-takeoff",
    standard: "MS EN 1991-1-1",
  },
  {
    name: "RC Slab Design (One-Way & Two-Way)",
    description: "Design one-way or two-way slabs with moment coefficients, steel area, and deflection check.",
    href: "/calculators/concrete/slab-design",
    standard: "MS EN 1992-1-1",
  },
  {
    name: "RC Beam Moment Capacity",
    description: "Beam moment capacity and utilisation check per EC2 Malaysia NA.",
    href: "/calculators/concrete/beam-moment",
    standard: "MS EN 1992-1-1",
  },
  {
    name: "RC Beam Shear Design",
    description: "Variable angle truss model shear design with VRd,c, VRd,max, and required Asw/s.",
    href: "/calculators/concrete/beam-shear",
    standard: "MS EN 1992-1-1, Cl. 6.2.3",
  },
  {
    name: "Deflection Check — Span/Depth Ratio",
    description: "Verify span-to-depth ratio against EC2 Cl. 7.4.2 limits with modification factors.",
    href: "/calculators/concrete/deflection-check",
    standard: "MS EN 1992-1-1, Cl. 7.4.2",
  },
  {
    name: "RC Column N-M Interaction",
    description: "Generate N-M interaction diagram with rectangular stress block and SVG visualisation.",
    href: "/calculators/concrete/column-interaction",
    standard: "MS EN 1992-1-1, Cl. 6.1",
  },
  {
    name: "Crack Width Control (SLS)",
    description: "Calculate wk per EC2 Cl. 7.3.4 with cracked section analysis and sr,max check.",
    href: "/calculators/concrete/crack-width",
    standard: "MS EN 1992-1-1, Cl. 7.3.4",
  },
  {
    name: "Isolated Pad Footing Design",
    description: "Three-check design: bearing pressure (SLS), flexure (ULS), and punching shear at 2d perimeter.",
    href: "/calculators/concrete/pad-footing",
    standard: "MS EN 1992-1-1 Cl. 6.4 & EN 1997-1",
  },
];

export default function ConcreteCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Structural Calculators</h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        RC beam, column, footing, and crack width design per MS EN 1992-1-1 (Eurocode 2 Malaysia NA).
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-2xl border border-orange-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-orange-400"
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
