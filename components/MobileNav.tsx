"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Full-screen backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Menu panel — fixed below header */}
          <div className="fixed left-0 right-0 top-[65px] z-50 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-lg max-h-[calc(100vh-65px)] overflow-y-auto">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Theme toggle in mobile menu */}
              <div className="flex items-center justify-between px-3 py-2.5 border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Dark Mode</span>
                <ThemeToggle />
              </div>

              {/* Auth links */}
              <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                {session ? (
                  <>
                    <a
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      My Profile
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      Create Account
                    </a>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
