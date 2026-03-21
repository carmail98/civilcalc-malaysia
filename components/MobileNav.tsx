"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

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
        onClick={() => setOpen(!open)}
        className="p-2 text-stone-600 hover:text-amber-700 transition-colors"
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
        <div className="absolute left-0 right-0 top-full z-50 border-b border-stone-200 bg-white shadow-lg">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Auth links */}
            <div className="border-t border-stone-100 mt-1 pt-1">
              {session ? (
                <>
                  <a
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    My Profile
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    Create Account
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
