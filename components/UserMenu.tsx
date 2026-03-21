"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
    );
  }

  if (!session) {
    return (
      <a
        href="/login"
        className="rounded-lg bg-amber-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
      >
        Sign In
      </a>
    );
  }

  const initials = session.user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 hover:bg-amber-200 transition-colors"
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-lg z-50">
          <div className="px-3 py-2 border-b border-stone-100">
            <p className="text-sm font-medium text-stone-800 truncate">
              {session.user?.name}
            </p>
            <p className="text-xs text-stone-500 truncate">
              {session.user?.email}
            </p>
          </div>
          <a
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            My Profile
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
