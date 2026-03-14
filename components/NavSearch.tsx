"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const calculators = [
  { name: "Rational Method — Peak Flow", href: "/calculators/drainage", category: "Drainage" },
  { name: "IDF Curve — Rainfall Intensity", href: "/calculators/drainage/idf", category: "Drainage" },
  { name: "Time of Concentration (Tc)", href: "/calculators/drainage/tc", category: "Drainage" },
  { name: "Manning's Drain Sizing", href: "/calculators/drainage/drain-sizing", category: "Drainage" },
  { name: "Culvert Hydraulic Design", href: "/calculators/drainage/culvert", category: "Drainage" },
  { name: "Detention Pond Volume", href: "/calculators/drainage/detention-pond", category: "Drainage" },
  { name: "Earthworks Cut & Fill Volume", href: "/calculators/earthworks", category: "Earthworks" },
  { name: "Slope Gradient & Batter", href: "/calculators/earthworks/slope", category: "Earthworks" },
  { name: "Dry Density & Compaction Check", href: "/calculators/earthworks/compaction", category: "Earthworks" },
  { name: "Flexible Pavement Design (JKR)", href: "/calculators/roads/pavement", category: "Roads" },
  { name: "Road Carriageway Width Check", href: "/calculators/roads", category: "Roads" },
  { name: "Sewer Pipe Sizing (MSIG/SPAN)", href: "/calculators/sewerage", category: "Sewerage" },
  { name: "Load Take-Off (Slab to Beam)", href: "/calculators/concrete/load-takeoff", category: "Structural" },
  { name: "RC Beam Moment Capacity", href: "/calculators/concrete", category: "Structural" },
];

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = query.length > 0
    ? calculators.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search...
          <kbd className="ml-2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-gray-400">/</kbd>
        </button>
      ) : (
        <div className="w-64">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setOpen(false); setQuery(""); }
              if (e.key === "Enter" && results.length > 0) navigate(results[0].href);
            }}
            placeholder="Search calculators..."
            className="w-full rounded-lg border border-blue-400 bg-white py-1.5 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-50 max-h-64 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.href}
                  onClick={() => navigate(r.href)}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="font-medium text-gray-900">{r.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{r.category}</span>
                </button>
              ))}
            </div>
          )}
          {query.length > 0 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-50 px-3 py-3 text-sm text-gray-400">
              No calculators found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
