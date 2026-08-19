"use client";

import { useEffect, useState } from "react";

export interface SavedCalculator {
  id: string;
  name: string;
  href: string;
  category: string;
  lastUsed: Date;
}

export function addToRecent(calc: Omit<SavedCalculator, "lastUsed">) {
  const saved = localStorage.getItem("recentCalculators");
  let recentList: SavedCalculator[] = [];
  
  if (saved) {
    try {
      recentList = JSON.parse(saved);
    } catch (e) {
      recentList = [];
    }
  }

  const filtered = recentList.filter((c) => c.id !== calc.id);
  const updated = [
    { ...calc, lastUsed: new Date() },
    ...filtered,
  ].slice(0, 10);

  localStorage.setItem("recentCalculators", JSON.stringify(updated));
}

export default function RecentCalculators() {
  const [recent, setRecent] = useState<SavedCalculator[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("recentCalculators");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecent(parsed.slice(0, 5));
      } catch (e) {
        console.error("Failed to parse recent calculators", e);
      }
    }
  }, []);

  const clearRecent = () => {
    localStorage.removeItem("recentCalculators");
    setRecent([]);
  };

  if (!mounted || recent.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Used
        </h3>
        <button
          onClick={clearRecent}
          className="text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2">
        {recent.map((calc) => (
          <li key={calc.id}>
            <a
              href={calc.href}
              className="block rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-700 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              <div className="font-medium">{calc.name}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">{calc.category}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
