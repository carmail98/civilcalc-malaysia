import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import MainNav from "@/components/MainNav";
import NavSearch from "@/components/NavSearch";
import UserMenu from "@/components/UserMenu";
import SessionProvider from "@/components/SessionProvider";
import FeedbackButton from "@/components/FeedbackButton";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivilCalc Malaysia — Engineering Calculation Tools",
  description:
    "Free civil engineering calculators based on Malaysian standards: MSMA, JKR, MS EN. Built for engineers, students, and consultants.",
};

const footerCalcCategories = [
  {
    category: "Drainage",
    items: [
      { href: "/calculators/drainage/rational-method", label: "Rational Method" },
      { href: "/calculators/drainage/idf", label: "IDF Curve" },
      { href: "/calculators/drainage/drain-sizing", label: "Drain Sizing" },
    ],
  },
  {
    category: "Earthworks",
    items: [
      { href: "/calculators/earthworks/cut-fill", label: "Cut & Fill" },
      { href: "/calculators/earthworks/compaction", label: "Compaction" },
      { href: "/calculators/earthworks/slope", label: "Slope Gradient" },
    ],
  },
  {
    category: "Roads",
    items: [
      { href: "/calculators/roads/pavement", label: "Pavement Design" },
      { href: "/calculators/roads/sight-distance", label: "Sight Distance" },
      { href: "/calculators/roads/traffic-volume", label: "Traffic PCU" },
    ],
  },
  {
    category: "Sewerage",
    items: [
      { href: "/calculators/sewerage/sewer-sizing", label: "Sewer Pipe Sizing" },
    ],
  },
  {
    category: "Concrete",
    items: [
      { href: "/calculators/concrete/slab-design", label: "Slab Design" },
      { href: "/calculators/concrete/beam-moment", label: "RC Beam Capacity" },
      { href: "/calculators/concrete/pad-footing", label: "Pad Footing" },
      { href: "/calculators/concrete/deflection-check", label: "Deflection Check" },
    ],
  },
  {
    category: "Geotechnical",
    items: [
      { href: "/calculators/geotechnical/bearing-capacity", label: "Bearing Capacity" },
      { href: "/calculators/geotechnical/settlement", label: "Settlement" },
      { href: "/calculators/geotechnical/pile-capacity", label: "Pile Capacity" },
    ],
  },
  {
    category: "Costing",
    items: [
      { href: "/calculators/costing/pce", label: "Cost Estimate" },
      { href: "/calculators/costing/ipc", label: "Payment Cert" },
      { href: "/calculators/costing/final-account", label: "Final Account" },
    ],
  },
  {
    category: "Environmental",
    items: [
      { href: "/calculators/environmental/water-demand", label: "Water Demand" },
      { href: "/calculators/environmental/eia-screening", label: "EIA Screening" },
    ],
  },
];

const footerStandards = [
  { label: "MSMA 2nd Edition", href: "https://www.water.gov.my" },
  { label: "JKR Standards", href: "https://www.jkr.gov.my" },
  { label: "MS EN (Eurocode)", href: "https://www.jsm.gov.my" },
  { label: "SPAN / MSIG", href: "https://www.span.gov.my" },
  { label: "DOE / EIA Order", href: "https://www.doe.gov.my" },
  { label: "BQSM / SMM2", href: "https://www.bqsm.gov.my" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
        <header className="sticky top-0 z-30 border-b border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 print:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-amber-700 dark:text-amber-400 shrink-0">
              CivilCalc<span className="text-stone-400 dark:text-stone-500">.online</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <MainNav />
              <NavSearch />
            </nav>

            {/* Auth + Mobile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <UserMenu />
              </div>
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-stone-200/80 dark:border-stone-700/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm mt-12 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-10">
            {/* Top row: About + Calculators by category */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_2fr]">
              {/* About column */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  CivilCalc<span className="text-stone-400 dark:text-stone-500">.online</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Free civil engineering calculators based on Malaysian
                  standards. Built for engineers, students, and consultants.
                </p>

                {/* Utility links */}
                <div className="space-y-1.5">
                  <a
                    href="/feedback"
                    className="block text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    Send Feedback / Request a Calculator &rarr;
                  </a>
                  <a
                    href="/news"
                    className="block text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    Changelog &amp; Release Notes
                  </a>
                  <a
                    href="/about"
                    className="block text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    Roadmap &amp; Planned Modules
                  </a>
                </div>

                {/* Standards */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1.5 mt-4">
                    Referenced Standards
                  </h4>
                  <ul className="space-y-1">
                    {footerStandards.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Calculators by category */}
              <div>
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Popular Calculators
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {footerCalcCategories.map((cat) => (
                    <div key={cat.category}>
                      <h5 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wide mb-1.5">
                        {cat.category}
                      </h5>
                      <ul className="space-y-1">
                        {cat.items.map((c) => (
                          <li key={c.href}>
                            <a
                              href={c.href}
                              className="text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 border-t border-stone-100 dark:border-stone-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400 dark:text-stone-500">
              <span>
                CivilCalc Malaysia &copy; {new Date().getFullYear()} — Engineering
                calculation aid only. All designs must be endorsed by a registered
                PE under BEM.
              </span>
              <a
                href="/feedback"
                className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-medium transition-colors"
              >
                Send Feedback
              </a>
            </div>
          </div>
        </footer>
        <FeedbackButton />
        <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
