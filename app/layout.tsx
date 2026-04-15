import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import NavSearch from "@/components/NavSearch";
import UserMenu from "@/components/UserMenu";
import SessionProvider from "@/components/SessionProvider";
import FeedbackButton from "@/components/FeedbackButton";
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

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

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
      { href: "/calculators/concrete/beam-moment", label: "RC Beam Capacity" },
      { href: "/calculators/concrete/beam-shear", label: "Beam Shear" },
      { href: "/calculators/concrete/column-interaction", label: "Column N-M" },
      { href: "/calculators/concrete/pad-footing", label: "Pad Footing" },
      { href: "/calculators/concrete/crack-width", label: "Crack Width" },
    ],
  },
];

const footerStandards = [
  { label: "MSMA 2nd Edition", href: "https://www.water.gov.my" },
  { label: "JKR Standards", href: "https://www.jkr.gov.my" },
  { label: "MS EN (Eurocode)", href: "https://www.jsm.gov.my" },
  { label: "SPAN / MSIG", href: "https://www.span.gov.my" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#faf8f5] text-stone-900`}
      >
        <SessionProvider>
        <header className="relative border-b border-stone-200/80 bg-white/90 backdrop-blur-sm print:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-amber-700 shrink-0">
              CivilCalc<span className="text-stone-400">.online</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-amber-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
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

        <footer className="border-t border-stone-200/80 bg-white/90 backdrop-blur-sm mt-12 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-10">
            {/* Top row: About + Calculators by category */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_2fr]">
              {/* About column */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-stone-800">
                  CivilCalc<span className="text-stone-400">.online</span>
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Free civil engineering calculators based on Malaysian
                  standards. Built for engineers, students, and consultants.
                </p>

                {/* Utility links */}
                <div className="space-y-1.5">
                  <a
                    href="/feedback"
                    className="block text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Send Feedback / Request a Calculator &rarr;
                  </a>
                  <a
                    href="/news"
                    className="block text-xs text-stone-500 hover:text-amber-600 transition-colors"
                  >
                    Changelog &amp; Release Notes
                  </a>
                  <a
                    href="/about"
                    className="block text-xs text-stone-500 hover:text-amber-600 transition-colors"
                  >
                    Roadmap &amp; Planned Modules
                  </a>
                </div>

                {/* Standards */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-800 mb-1.5 mt-4">
                    Referenced Standards
                  </h4>
                  <ul className="space-y-1">
                    {footerStandards.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-stone-500 hover:text-amber-600 transition-colors"
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
                <h4 className="text-sm font-semibold text-stone-800 mb-3">
                  Popular Calculators
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {footerCalcCategories.map((cat) => (
                    <div key={cat.category}>
                      <h5 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
                        {cat.category}
                      </h5>
                      <ul className="space-y-1">
                        {cat.items.map((c) => (
                          <li key={c.href}>
                            <a
                              href={c.href}
                              className="text-xs text-stone-500 hover:text-amber-600 transition-colors"
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
            <div className="mt-8 border-t border-stone-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
              <span>
                CivilCalc Malaysia &copy; {new Date().getFullYear()} — Engineering
                calculation aid only. All designs must be endorsed by a registered
                PE under BEM.
              </span>
              <a
                href="/feedback"
                className="text-amber-500 hover:text-amber-600 font-medium transition-colors"
              >
                Send Feedback
              </a>
            </div>
          </div>
        </footer>
        <FeedbackButton />
        </SessionProvider>
      </body>
    </html>
  );
}
