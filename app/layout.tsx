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

const footerCalcs = [
  { href: "/calculators/drainage", label: "Rational Method" },
  { href: "/calculators/drainage/idf", label: "IDF Curve" },
  { href: "/calculators/drainage/drain-sizing", label: "Drain Sizing" },
  { href: "/calculators/earthworks", label: "Cut & Fill" },
  { href: "/calculators/roads/pavement", label: "Pavement Design" },
  { href: "/calculators/sewerage", label: "Sewer Pipe Sizing" },
  { href: "/calculators/concrete", label: "RC Beam Capacity" },
  { href: "/calculators/concrete/beam-shear", label: "Beam Shear Design" },
  { href: "/calculators/concrete/column-interaction", label: "Column N-M Interaction" },
  { href: "/calculators/concrete/pad-footing", label: "Pad Footing Design" },
  { href: "/calculators/concrete/crack-width", label: "Crack Width SLS" },
  { href: "/calculators/report-generator", label: "Report Generator" },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <SessionProvider>
        <header className="relative border-b border-gray-200 bg-white print:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-blue-700 shrink-0">
              CivilCalc<span className="text-gray-500">.my</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-blue-700 transition-colors"
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

        <footer className="border-t border-gray-200 bg-white mt-12 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {/* About */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  CivilCalc<span className="text-gray-400">.my</span>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Free civil engineering calculators based on Malaysian
                  standards. Built for engineers, students, and consultants.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Popular Calculators
                </h4>
                <ul className="space-y-1.5">
                  {footerCalcs.map((c) => (
                    <li key={c.href}>
                      <a
                        href={c.href}
                        className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standards */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Referenced Standards
                </h4>
                <ul className="space-y-1.5">
                  {footerStandards.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
              CivilCalc Malaysia &copy; {new Date().getFullYear()} — Engineering
              calculation aid only. All designs must be endorsed by a registered
              PE under BEM.
            </div>
          </div>
        </footer>
        <FeedbackButton />
        </SessionProvider>
      </body>
    </html>
  );
}
