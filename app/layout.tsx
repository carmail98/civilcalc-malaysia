import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <header className="border-b border-gray-200 bg-white print:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-blue-700 shrink-0">
              CivilCalc<span className="text-gray-500">.my</span>
            </a>
            <nav className="flex gap-4 sm:gap-6 text-sm font-medium text-gray-600 overflow-hidden">
              <a href="/" className="hover:text-blue-700 whitespace-nowrap">
                Home
              </a>
              <a href="/calculators/drainage" className="hover:text-blue-700 whitespace-nowrap">
                Drainage
              </a>
              <a href="/calculators/earthworks" className="hover:text-blue-700 whitespace-nowrap">
                Earthworks
              </a>
              <a href="/calculators/roads" className="hover:text-blue-700 whitespace-nowrap">
                Roads
              </a>
              <a href="/calculators/sewerage" className="hover:text-blue-700 whitespace-nowrap">
                Sewerage
              </a>
              <a href="/calculators/concrete" className="hover:text-blue-700 whitespace-nowrap">
                Structural
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-12 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-gray-400">
            CivilCalc Malaysia &copy; {new Date().getFullYear()} — Engineering
            calculation aid only. All designs must be endorsed by a registered
            PE under BEM.
          </div>
        </footer>
      </body>
    </html>
  );
}
